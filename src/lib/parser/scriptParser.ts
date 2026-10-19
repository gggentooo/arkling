import type { LanguageCode, ScriptLine } from '../../types';

export interface ParsedDialogueLine {
  speaker: string;
  text: string;
  isDecision?: boolean;
}

/**
 * Sanitizes in-game Arknights text formatting:
 * - Replaces {@nickname} with Doctor
 * - Strips <color=...> tags and custom bbcode-like tags
 * - Cleans up escaped newlines and extra spaces
 */
export function sanitizeDialogueText(raw: string): string {
  if (!raw) return '';

  return (
    raw
      // Replace in-game Doctor nickname placeholder
      .replace(/\{@nickname\}/gi, 'Doctor')
      // Strip color tags: <color=#123456>...</color>
      .replace(/<color=[^>]+>/gi, '')
      .replace(/<\/color>/gi, '')
      // Strip keyword/custom tags like <@ba.kw>...</> or <@...>...</>
      .replace(/<@[^>]*>/gi, '')
      .replace(/<\/>/gi, '')
      // Strip generic HTML tags except standard text
      .replace(/<(?!\/?(?:b|i|u|ruby|rt)\b)[^>]+>/gi, '')
      // Replace literal \n in scripts
      .replace(/\\n/g, '\n')
      .trim()
  );
}

/**
 * Parses raw Arknights script text into structured dialogue lines.
 */
export function parseArknightsScript(rawScript: string): ParsedDialogueLine[] {
  const result: ParsedDialogueLine[] = [];
  const lines = rawScript.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine || rawLine.startsWith('//')) {
      continue;
    }

    // 1. Check for dialogue with speaker: [name="Speaker", ...] Dialogue
    const nameMatch = rawLine.match(/^\[name="?([^",\]]*)"?(?:,[^\]]*)?\]\s*(.*)$/i);
    if (nameMatch) {
      const speaker = sanitizeDialogueText(nameMatch[1]);
      let dialogue = nameMatch[2]?.trim() || '';

      // If the dialogue wasn't inline on the same line, check if the next line is plain text
      if (!dialogue && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine && !nextLine.startsWith('[') && !nextLine.startsWith('//')) {
          dialogue = nextLine;
          i++;
        }
      }

      if (dialogue) {
        result.push({
          speaker,
          text: sanitizeDialogueText(dialogue)
        });
      }
      continue;
    }

    // 2. Check for decision commands: [decision(options="Option 1;Option 2", ...)]
    const decisionMatch = rawLine.match(/^\[decision\(.*options="([^"]*)".*\)\]/i);
    if (decisionMatch) {
      const rawOptions = decisionMatch[1];
      const options = rawOptions.split(';').map((opt, idx) => `[${idx + 1}] ${opt.trim()}`).join('   ');
      result.push({
        speaker: 'Decision',
        text: sanitizeDialogueText(options),
        isDecision: true
      });
      continue;
    }

    // 3. Check for subtitle lines: [subtitle(text="...", ...)]
    const subtitleMatch = rawLine.match(/^\[subtitle\(.*text="([^"]*)".*\)\]/i);
    if (subtitleMatch) {
      result.push({
        speaker: 'Subtitle',
        text: sanitizeDialogueText(subtitleMatch[1])
      });
      continue;
    }

    // 4. Plain line without brackets (Narrator or monologue)
    if (!rawLine.startsWith('[')) {
      result.push({
        speaker: '',
        text: sanitizeDialogueText(rawLine)
      });
      continue;
    }

    // Other directives (music, background, fx) are ignored for script reading
  }

  return result;
}

/**
 * Aligns dialogue lines from target and system language scripts into unified ScriptLine objects.
 */
export function alignScripts(
  targetParsed: ParsedDialogueLine[],
  systemParsed: ParsedDialogueLine[],
  targetLang: LanguageCode,
  systemLang: LanguageCode
): ScriptLine[] {
  const maxLen = Math.max(targetParsed.length, systemParsed.length);
  const aligned: ScriptLine[] = [];

  for (let i = 0; i < maxLen; i++) {
    const t = targetParsed[i];
    const s = systemParsed[i];

    const speakerMap: Partial<Record<LanguageCode, string>> = {};
    if (t?.speaker) speakerMap[targetLang] = t.speaker;
    if (s?.speaker) speakerMap[systemLang] = s.speaker;

    const textMap: Record<LanguageCode, string> = {
      zh: '',
      en: '',
      ja: '',
      ko: ''
    };

    if (t) {
      textMap[targetLang] = t.text;
    }
    if (s) {
      textMap[systemLang] = s.text;
    } else if (systemParsed.length === 0 && targetParsed.length > 0) {
      // In case the system language script was not found / not yet localized
      textMap[systemLang] = '(Translation not yet available for this line)';
    }

    aligned.push({
      id: `line-${i + 1}`,
      speaker: speakerMap,
      text: textMap
    });
  }

  return aligned;
}

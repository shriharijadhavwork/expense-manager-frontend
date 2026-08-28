import type { ConversationMessage } from "@/components/landing/conversation-scenarios";

export type AnimEvent =
  | { kind: "typing"; side: "left" | "right" }
  | { kind: "message"; index: number };

export function buildAnimEvents(messages: ConversationMessage[]): AnimEvent[] {
  const events: AnimEvent[] = [];

  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];
    events.push({
      kind: "typing",
      side: message.type === "user" ? "right" : "left",
    });
    events.push({ kind: "message", index });
  }

  return events;
}

export function buildAnimTimeline(
  events: AnimEvent[],
  messages: ConversationMessage[],
): number[] {
  let elapsed = 400;
  const timeline: number[] = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (event.kind === "typing") {
      const nextEvent = events[i + 1];
      const nextMessage =
        nextEvent?.kind === "message"
          ? messages[nextEvent.index]
          : messages[0];
      elapsed += nextMessage.type === "user" ? 420 : 620;
    } else {
      elapsed += messages[event.index].type === "user" ? 580 : 880;
    }

    timeline.push(elapsed);
  }

  return timeline;
}

export function getDisplayState(stage: number, events: AnimEvent[]) {
  const visibleMessageIndices: number[] = [];
  let typing: "left" | "right" | null = null;

  if (stage <= 0) {
    return { visibleMessageIndices, typing };
  }

  for (let i = 0; i < stage; i++) {
    const event = events[i];
    if (event.kind === "message") {
      visibleMessageIndices.push(event.index);
    }
  }

  const lastEvent = events[stage - 1];
  if (lastEvent?.kind === "typing") {
    typing = lastEvent.side;
  }

  return { visibleMessageIndices, typing };
}

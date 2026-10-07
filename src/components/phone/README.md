# Phone kit: an Android phone with a Google Messages RCS conversation

Reusable, mock-data mockup pieces for case studies. Everything is JSX, lucide icons, and
phone-local CSS variables. No web fonts, no images, no network requests.

```tsx
import { AndroidPhone, MessagesHeader, MessageBubble, Timestamp, RichCard, SuggestionChips, Composer, TypingIndicator, AgentInfo } from "@/components/phone";

<AndroidPhone brandColor="#1F4FE0" theme="auto" fit="contain">
  <MessagesHeader logo={<Logo />} name="Poblano's Mexican Grill" verified subtitle="Verified business" />
  <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-4 pb-2">
    <Timestamp>Today · 9:30 AM</Timestamp>
    <MessageBubble from="agent">Hi Sam, the Tuesday Family Box is back this week.</MessageBubble>
    <RichCard title="Tuesday Family Box" meta="$32" description="Four entrees, two sides, and two sauces." mediaHeight="short" width="86%" />
    <MessageBubble from="user" status="read">Order for pickup</MessageBubble>
    <TypingIndicator />
  </div>
  <SuggestionChips wrap suggestions={[{ label: "Order for pickup" }, { label: "Call us", kind: "dial" }]} onSelect={(i) => ...} />
  <Composer />
</AndroidPhone>
```

## Components

| Component | What it is |
| --- | --- |
| `AndroidPhone` | The Pixel-style frame: thin bezel, 48px corners, centered pill cutout, status bar (time left, signal, wifi, and battery right), and the gesture pill. The screen is laid out at a fixed 360 x 780 logical px and zoomed to fit, so children always render at phone proportions. Props: `brandColor`, `theme` ("light", "dark", or "auto" to follow the site), `width` (CSS px; omit to fill the container), `fit` ("width" or "contain", which also respects the container height), `time`, `label`. Children render inside a flex column; make the thread `flex-1 min-h-0`. |
| `MessagesHeader` | Back arrow, the logo clipped to a rounded square, the display name with the verified check, an optional subtitle, optional call icon, and overflow. |
| `MessageBubble` | One message. `from="agent"` sits left in a tonal container; `from="user"` sits right in the brand color. 28px corners; `tail` (default on) puts the 4px tail corner on the latest bubble. `status` ("sent", "delivered", "read") and `time` render under it. `ghost` draws a dashed placeholder. `Timestamp` is the centered day divider. |
| `RichCard` | Media on top (`mediaHeight` short 112, medium 168, tall 264), title, optional `meta` (a price), description, and up to four suggestions as text buttons. `RichCardCarousel` lays out 2 to 10 cards at Google's fixed widths (small 180, medium 296). `MediaPlaceholder` is the brand gradient used when no media is given. |
| `SuggestionChips` | Material 3 outlined chips above the composer. `kind` adds the action icon: `dial`, `url`, `location`, `share-location`, `calendar`. `selected` fills the chip; `disabled` dims the rest. Horizontal scroll by default, `wrap` to wrap. Caps at 11 chips and 25 characters per label. |
| `Composer` | "+" attachment, the pill text field with the "RCS message" placeholder, camera and gallery icons, and the brand-colored send button once `text` is set. Decorative, nothing focusable. |
| `TypingIndicator` | Three bouncing dots in an agent bubble. Static under reduced motion. |
| `AgentInfo` | The info screen: 45:14 banner, the logo overlapping it, name, "Verified business" line, description, website, phone, and email rows, and the privacy and terms links. |

Tokens: `phoneTokens(brand, theme)` derives `--ph-brand`, `--ph-on-brand`, `--ph-brand-text` (lightened in dark), `--ph-brand-soft`, `--ph-bg`, `--ph-surface-low`, `--ph-surface-high`, `--ph-on-surface`, `--ph-on-surface-variant`, `--ph-outline`, `--ph-outline-variant`, `--ph-verified`, and the frame colors. Surfaces are tinted a few percent toward the brand color (the "dynamic color" look). Font stack inside the phone only: `Roboto, "Google Sans", system-ui, sans-serif`.

Keep site tokens (Tailwind `bg-surface` and friends) outside the phone, and phone tokens inside it.

## What an RBM conversation looks like (research notes, Oct 2026)

- Agent identity: display name up to 40 characters, description up to 100, a 224 x 224 logo under 50 KB shown as a rounded square since April 2026, a 1440 x 448 (45:14) banner under 200 KB, and a brand color (#RRGGBB) with at least 4.5:1 contrast on white. The brand color tints header accents and buttons. Verified agents get the check next to the name automatically.
- Agent info screen: banner with the logo overlapping it, name, description, phone (E.164), up to three labeled websites, an email on the brand's domain, and privacy policy and terms links (both required before launch).
- Bubbles: agent messages on the left in a neutral tonal container, the user's on the right in the primary (brand) color, pill-shaped with a small tail corner on the last of a run. Outgoing messages show sending, sent, delivered, and read states; read uses the filled double check. Agents can send a typing event so the thread shows the typing indicator.
- Rich cards: vertical cards put media on top at short 112, medium 168, or tall 264 dp (aspect 7:2, 21:9, or 3:2), then title (200 chars), description (2000), and up to four suggestions. Horizontal cards fix the media at 128 dp wide. Carousels hold 2 to 10 cards at small 180 or medium 296 dp wide, all scaled to the tallest.
- Suggestions: up to 11 per message, labels up to 25 characters, postback up to 2048. Replies are plain chips; actions carry an icon: dial a number, open a URL (browser or webview), view a location, share location, or create a calendar event. They render as outlined chips in a row above the composer.
- Composer: the placeholder reads "RCS message" on an RCS thread and "Text message" on SMS, with the attachment "+", camera and gallery icons, and a send button once there is text.
- Material 3: surface, surface container, and surface container high are the tonal tiers for the ground, panels, and floating cards; extended shapes use 28 dp corners; chips are 32 dp tall. Google Messages chips render as pills.
- System chrome on a Pixel: clock top left, signal, wifi, and battery top right, a centered camera cutout, and the thin gesture pill at the bottom. This is standard Pixel layout, not quoted from a spec page.

Not confirmed from a primary source within the research window: the exact "Verified business" string (third parties paraphrase it), exact bubble radii and color tokens, the composer icon order, and whether Messages uses Roboto or Google Sans for the thread. The kit uses sensible Material 3 values for those.

## Sources

- Agent information (name, description, logo, banner, brand color, contacts): https://developers.google.com/business-communications/rcs-business-messaging/guides/build/agents/edit-agent-information
- Release notes (rounded-square logo and verified check, April 2026): https://developers.google.com/business-communications/rcs-business-messaging/whats-new/latest-releases
- Rich cards and carousels (heights, widths, limits): https://developers.google.com/business-communications/rcs-business-messaging/guides/learn/rich-cards
- Suggestions (11 per message, 25-char labels, 2048 postback): https://developers.google.com/business-communications/rcs-business-messaging/reference/rest/v1/phones.agentMessages
- What RBM can do (action types, typing events): https://developers.google.com/business-communications/rcs-business-messaging/guides/learn/what-can-rbm-do
- Material 3 color roles (surface containers): https://m3.material.io/styles/color/roles
- Material 3 cards and shapes: https://m3.material.io/components/cards/specs
- Android system bars and cutouts: https://developer.android.com/design/ui/mobile/guides/foundations/system-bars
- "RCS message" composer placeholder (press coverage): https://www.androidpolice.com/google-messages-beta-rcs-chats-new-badge/
- Read receipt icon states (press coverage): https://www.androidpolice.com/read-receipts-in-google-messages-get-a-bolder-look/
- Agent description limit (secondary): https://docs.aws.amazon.com/sms-voice/latest/userguide/rcs-compliance-agent-description.html

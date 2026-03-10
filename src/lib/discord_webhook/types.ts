export type Snowflake = string;

export enum WebhookMessageFlags {
  /** Do not include embeds when serializing this message. */
  SUPPRESS_EMBEDS = 1 << 2,
  /** Do not trigger push and desktop notifications for this message. */
  SUPPRESS_NOTIFICATIONS = 1 << 12,
  /** Message uses Components V2 payload shape. */
  IS_COMPONENTS_V2 = 1 << 15,
}

/** Allowed mentions object for controlling role/user/everyone pings. */
export interface AllowedMentions {
  /** Types of mentions to automatically parse from message content. */
  /** @default undefined */
  parse?: Array<"roles" | "users" | "everyone">;
  /** Explicit role IDs that may be mentioned. */
  /** @default undefined */
  roles?: Snowflake[];
  /** Explicit user IDs that may be mentioned. */
  /** @default undefined */
  users?: Snowflake[];
  /** Whether to mention the author of the message being replied to. */
  /** @default undefined */
  replied_user?: boolean;
}

/** Embed footer object. */
export interface EmbedFooter {
  /** Footer text. */
  text: string;
  /** URL of footer icon (only supports http(s) and attachments). */
  /** @default undefined */
  icon_url?: string;
  /** Proxied URL of footer icon. */
  /** @default undefined */
  proxy_icon_url?: string;
}

/** Embed image object. */
export interface EmbedImage {
  /** Source URL of image (supports http(s) and attachments). */
  /** @default undefined */
  url?: string;
  /** Proxied URL of image. */
  /** @default undefined */
  proxy_url?: string;
  /** Image height in pixels. */
  /** @default undefined */
  height?: number;
  /** Image width in pixels. */
  /** @default undefined */
  width?: number;
}

/** Embed thumbnail object. */
export interface EmbedThumbnail {
  /** Source URL of thumbnail (supports http(s) and attachments). */
  /** @default undefined */
  url?: string;
  /** Proxied URL of thumbnail. */
  /** @default undefined */
  proxy_url?: string;
  /** Thumbnail height in pixels. */
  /** @default undefined */
  height?: number;
  /** Thumbnail width in pixels. */
  /** @default undefined */
  width?: number;
}

/** Embed video object. */
export interface EmbedVideo {
  /** Source URL of video. */
  /** @default undefined */
  url?: string;
  /** Proxied URL of video. */
  /** @default undefined */
  proxy_url?: string;
  /** Video height in pixels. */
  /** @default undefined */
  height?: number;
  /** Video width in pixels. */
  /** @default undefined */
  width?: number;
}

/** Embed provider object. */
export interface EmbedProvider {
  /** Name of provider. */
  /** @default undefined */
  name?: string;
  /** URL of provider. */
  /** @default undefined */
  url?: string;
}

/** Embed author object. */
export interface EmbedAuthor {
  /** Name of author. */
  name: string;
  /** URL of author. */
  /** @default undefined */
  url?: string;
  /** URL of author icon. */
  /** @default undefined */
  icon_url?: string;
  /** Proxied URL of author icon. */
  /** @default undefined */
  proxy_icon_url?: string;
}

/** Embed field object. */
export interface EmbedField {
  /** Name of the field. */
  name: string;
  /** Value of the field. */
  value: string;
  /** Whether this field should display inline. */
  /** @default undefined */
  inline?: boolean;
}

/** Embed object (rich content up to 10 embeds per message). */
export interface DiscordEmbed {
  /** Embed title. */
  /** @default undefined */
  title?: string;
  /** Type of embed. */
  /** @default "rich" */
  type?: "rich";
  /** Embed description. */
  /** @default undefined */
  description?: string;
  /** URL of embed. */
  /** @default undefined */
  url?: string;
  /** ISO8601 timestamp string. */
  /** @default undefined */
  timestamp?: string;
  /** Decimal color code. */
  /** @default undefined */
  color?: number;
  /** Footer information. */
  /** @default undefined */
  footer?: EmbedFooter;
  /** Image information. */
  /** @default undefined */
  image?: EmbedImage;
  /** Thumbnail information. */
  /** @default undefined */
  thumbnail?: EmbedThumbnail;
  /** Video information. */
  /** @default undefined */
  video?: EmbedVideo;
  /** Provider information. */
  /** @default undefined */
  provider?: EmbedProvider;
  /** Author information. */
  /** @default undefined */
  author?: EmbedAuthor;
  /** Array of embed fields (max 25). */
  /** @default undefined */
  fields?: EmbedField[];
}

/** Message component object (action row, button, select, text input, etc.). */
export interface MessageComponent {
  /** Component type discriminator. */
  type: number;
  [key: string]: unknown;
}

/** File payload used when sending multipart webhook requests. */
export interface WebhookFile {
  /** File name presented to Discord. */
  filename: string;
  /** File content payload. */
  content: string;
}

/** Partial attachment object used to set uploaded file metadata. */
export interface PartialAttachment {
  /** Attachment ID in the `files[n]` list. */
  /** @default undefined */
  id?: Snowflake;
  /** Attachment filename. */
  filename: string;
  /** Attachment description. */
  /** @default undefined */
  description?: string;
}

/** Poll answer emoji object. */
export interface PollEmoji {
  /** Emoji ID for custom emojis. */
  /** @default undefined */
  id?: Snowflake;
  /** Emoji unicode name for standard emojis. */
  /** @default undefined */
  name?: string;
}

/** Poll media object. */
export interface PollMedia {
  /** Poll answer text. */
  text: string;
  /** Optional answer emoji. */
  /** @default undefined */
  emoji?: PollEmoji;
}

/** Poll answer object. */
export interface PollAnswer {
  /** Poll answer media payload. */
  poll_media: PollMedia;
}

/** Poll question object. */
export interface PollQuestion {
  /** Poll question text. */
  text: string;
}

/** Poll request object. */
export interface PollRequest {
  /** Poll question. */
  question: PollQuestion;
  /** Poll answers. */
  answers: PollAnswer[];
  /** Poll duration in hours. */
  duration: number;
  /** Whether multiple answers can be selected. */
  /** @default false */
  allow_multiselect?: boolean;
  /** Poll layout type. */
  /** @default 1 */
  layout_type?: number;
}

/**
 * Discord webhook execute payload.
 * At least one of `content`, `files`, `embeds`, or `poll` should be provided.
 */
export interface WebhookMessage {
  /** The message contents (up to 2000 characters). */
  /** @default undefined */
  content?: string;
  /** Override the default webhook username. */
  /** @default undefined */
  username?: string;
  /** Override the default webhook avatar URL. */
  /** @default undefined */
  avatar_url?: string;
  /** Whether this is a text-to-speech message. */
  /** @default false */
  tts?: boolean;
  /** Embedded rich content (up to 10 embeds). */
  /** @default undefined */
  embeds?: DiscordEmbed[];
  /** Allowed mentions configuration for this message. */
  /** @default undefined */
  allowed_mentions?: AllowedMentions;
  /** Message components to include with the message. */
  /** @default undefined */
  components?: MessageComponent[];
  /** Files to upload with the message (multipart/form-data). */
  /** @default undefined */
  files?: WebhookFile[];
  /** JSON-encoded body for non-file params in multipart requests. */
  /** @default undefined */
  payload_json?: string;
  /** Attachment metadata for uploaded files. */
  /** @default undefined */
  attachments?: PartialAttachment[];
  /** Message flags bitfield. */
  /** @default 0 */
  flags?: number;
  /** Name of thread to create (forum/media channels only). */
  /** @default undefined */
  thread_name?: string;
  /** Tag IDs to apply to created thread (forum/media channels only). */
  /** @default undefined */
  applied_tags?: Snowflake[];
  /** Poll payload. */
  /** @default undefined */
  poll?: PollRequest;
}

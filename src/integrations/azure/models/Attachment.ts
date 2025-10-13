import { randomBytes } from 'crypto';

/**
* Represents a file attachment to be published in Azure DevOps test results.
* Handles encoding, naming, and centralized storage of attachments.
*/
export class Attachment {
  /** Base64-encoded content of the attachment */
  stream: string;

  /** Generated filename with timestamp and random suffix */
  fileName: string;

  /** Description or context for the attachment */
  comment: string;

  /** Type of attachment as expected by Azure DevOps API */
  attachmentType: string = 'GeneralAttachment';

  /** Static collection of attachments to be published */
  private static attachments: Attachment[] = [];

  /**
   * Creates a new attachment instance and encodes its content.
   * @param extension File extension (e.g., 'txt', 'png')
   * @param value Raw content of the file
   * @param comment Description or context for the attachment
   */
  constructor(extension: string, value: string, comment: string) {
    this.stream = Buffer.from(value).toString('base64');
    this.fileName = `Evidence_${Attachment.getDate()}_${Attachment.getTime()}_${Attachment.randomString(8)}.${extension}`;
    this.comment = comment;
  }

  /**
   * Adds an attachment to the global collection.
   * @param attachment The attachment instance to store
   */
  static setAttachment(attachment: Attachment): void {
    this.attachments.push(attachment);
  }

  /**
   * Clears all stored attachments.
   */
  static clearAttachments(): void {
    this.attachments = [];
  }

  /**
   * Retrieves all stored attachments.
   * @returns Array of Attachment instances
   */
  static getAttachments(): Attachment[] {
    return this.attachments;
  }

  /**
   * Generates a date string in YYYYMMDD format.
   */
  private static getDate(): string {
    return new Date().toISOString().split('T')[0].replace(/-/g, '');
  }

  /**
   * Generates a time string in HHMMSS format.
   */
  private static getTime(): string {
    return new Date().toTimeString().split(' ')[0].replace(/:/g, '');
  }

  /**
   * Generates a random alphanumeric string of the specified length.
   * @param length Number of characters to generate
   */
  private static randomString(length: number): string {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}
/**
* Service responsible for extracting the test case ID from a test title.
* Expected format: @[12345] where 12345 is the Azure DevOps test case ID.
*/
export class TestIdExtractor {
  /**
   * Extracts the test case ID from a test title string.
   * @param title The title of the test containing the @[ID] annotation.
   * @returns The extracted test case ID as a string, or undefined if not found.
   */
  static extract(title: string): string | undefined {
    const match = title.match(/@\[(\d+)\]/);
    return match ? match[1] : undefined;
  }
}
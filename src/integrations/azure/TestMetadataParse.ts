/**
* Represents structured metadata extracted from a test title.
*/
export type TestMetadata = {
  planId: string;
  suiteId: string;
  testCaseId: string;
};

/**
* Service responsible for parsing test metadata from test titles.
* Expected format: @PLAN_ID=xxx @SUITE_ID=xxx @[testCaseId]
*/
export class TestMetadataParser {
  /**
   * Extracts metadata from a test title string.
   * @param title The title of the test containing metadata annotations.
   * @returns A structured object with planId, suiteId, and testCaseId.
   * @throws Error if any required metadata is missing or malformed.
   */
  static extract(title: string): TestMetadata {
    const planMatch = title.match(/@PLAN_ID=(\d+)/);
    const suiteMatch = title.match(/@SUITE_ID=(\d+)/);
    const caseMatch = title.match(/@\[(\d+)\]/);

    if (!planMatch || !suiteMatch || !caseMatch) {
      throw new Error(
        'Missing metadata in test title. Expected format: @PLAN_ID=xxx @SUITE_ID=xxx @[testCaseId]'
      );
    }

    return {
      planId: planMatch[1],
      suiteId: suiteMatch[1],
      testCaseId: caseMatch[1]
    };
  }
}
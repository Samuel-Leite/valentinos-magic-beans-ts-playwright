/**
* Represents the outcome of a test case execution in Azure DevOps.
* Used to communicate the result status when publishing test results.
*/
export class Results {
  /**
   * Azure DevOps outcome code:
   *  - 0: Unspecified
   *  - 1: Interrupted
   *  - 2: Passed
   *  - 3: Failed
   *  - 4: Skipped / Timeout
   */
  constructor(public outcome: number) {}
}
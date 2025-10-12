/**
* Represents the activation payload for a test point in Azure DevOps.
* Used to mark a test case as active before execution begins.
*/
export class TestCaseActive {
  /**
   * @param id The unique identifier of the test point.
   * @param isActive Indicates whether the test point should be marked as active.
   */
  constructor(public id: number, public isActive: boolean) {}
}
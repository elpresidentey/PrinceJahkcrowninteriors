import { describe, expect, it } from "vitest";
import { describeUploadProblem } from "@/lib/supabase/storage";

function makeFile(name: string, type: string, size: number): File {
  // The body bytes ARE the file size: a 9 MB logical size needs a 9 MB body.
  const body = new ArrayBuffer(size);
  return new File([body], name, { type });
}

describe("describeUploadProblem", () => {
  it("accepts a normal JPEG", () => {
    expect(describeUploadProblem(makeFile("living-room.jpg", "image/jpeg", 1024))).toBeNull();
  });

  it("rejects files that are not allowed image types", () => {
    expect(describeUploadProblem(makeFile("resume.pdf", "application/pdf", 1024))).toMatch(
      /not a JPEG/
    );
  });

  it("rejects files over 8 MB", () => {
    expect(describeUploadProblem(makeFile("big.jpg", "image/jpeg", 9 * 1024 * 1024))).toMatch(
      /larger than 8 MB/
    );
  });
});

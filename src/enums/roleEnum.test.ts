import { describe, it, expect } from "vitest";
import { Role, getAvailableRoles } from "./roleEnum";

describe("getAvailableRoles", () => {
  it("OWNER returns [OWNER, EDITOR, VIEWER]", () => {
    expect(getAvailableRoles(Role.OWNER)).toEqual([Role.OWNER, Role.EDITOR, Role.VIEWER]);
  });

  it("EDITOR returns [EDITOR, VIEWER]", () => {
    expect(getAvailableRoles(Role.EDITOR)).toEqual([Role.EDITOR, Role.VIEWER]);
  });

  it("VIEWER returns [VIEWER]", () => {
    expect(getAvailableRoles(Role.VIEWER)).toEqual([Role.VIEWER]);
  });
});

describe("Role constant values", () => {
  it("OWNER is OWNER", () => {
    expect(Role.OWNER).toBe("OWNER");
  });

  it("EDITOR is EDITOR", () => {
    expect(Role.EDITOR).toBe("EDITOR");
  });

  it("VIEWER is VIEWER", () => {
    expect(Role.VIEWER).toBe("VIEWER");
  });
});

import { expect } from "chai";
import { describe, it } from "mocha";
import path from "node:path";
import fs from "fs-extra";
import { fileURLToPath } from "node:url";
import os from "node:os";

import {
  mineRoleImplicitFields,
  minePlatformImplicitFields,
  mineBlobSuffixes,
  mineAllImplicitFromDslCommons,
} from "../src/language/dslCommonsMiner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REL_BUILTIN =
  "WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/BuiltinObjects.java";
const REL_OBJECT_BUILDER =
  "WebCompiler-lib/src/main/java/com/mezzanine/program/web/builder/object/ObjectBuilder.java";

describe("dslCommonsMiner", () => {
  it("mineRoleImplicitFields returns all ATTR_* values from Identity class", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "helium-miner-"));
    try {
      await fs.ensureDir(path.join(tmp, path.dirname(REL_BUILTIN)));
      await fs.writeFile(
        path.join(tmp, REL_BUILTIN),
        `public class BuiltinObjects {
    public static class Identity {
        public static final String NAME = "Identity";
        public static final String ATTR_ID = "_id";
        public static final String ATTR_FIRST_NAMES = "_firstNames";
        public static final String ATTR_NICK_NAME = "_nickName";
        public static final String ATTR_SURNAME = "_surname";
        public static final String ATTR_LOCALE = "_locale";
        public static final String ATTR_TIME_ZONE = "_timeZone";
        public static final String ATTR_MUST_RESET_PASSWORD = "_mustResetPassword";
        public static final String ATTR_LAST_PASSWORD_RESET = "_lastPasswordReset";
    }
}`
      );
      const result = mineRoleImplicitFields(tmp);
      expect(result).to.not.equal(null);
      expect(result).to.include("_id");
      expect(result).to.include("_timeZone");
      expect(result).to.include("_firstNames");
      expect(result!.length).to.equal(8);
      expect(result).to.deep.equal(
        [
          "_firstNames",
          "_id",
          "_lastPasswordReset",
          "_locale",
          "_mustResetPassword",
          "_nickName",
          "_surname",
          "_timeZone",
        ].sort()
      );
    } finally {
      await fs.remove(tmp).catch(() => {});
    }
  });

  it("minePlatformImplicitFields returns [_id] from ObjectBuilder ATTR_ID", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "helium-miner-"));
    try {
      await fs.ensureDir(path.join(tmp, path.dirname(REL_OBJECT_BUILDER)));
      await fs.writeFile(
        path.join(tmp, REL_OBJECT_BUILDER),
        `public class ObjectBuilder {
    public static final String ATTR_ID = "_id";
    public static final String BLOB_FILE_NAME = "_fname__";
    public static final String BLOB_MIME_TYPE = "_mtype__";
    public static final String BLOB_SIZE = "_size__";
}`
      );
      const result = minePlatformImplicitFields(tmp);
      expect(result).to.deep.equal(["_id"]);
    } finally {
      await fs.remove(tmp).catch(() => {});
    }
  });

  it("mineBlobSuffixes returns fname, mtype, size from ObjectBuilder", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "helium-miner-"));
    try {
      await fs.ensureDir(path.join(tmp, path.dirname(REL_OBJECT_BUILDER)));
      await fs.writeFile(
        path.join(tmp, REL_OBJECT_BUILDER),
        `public class ObjectBuilder {
    public static final String ATTR_ID = "_id";
    public static final String BLOB_FILE_NAME = "_fname__";
    public static final String BLOB_MIME_TYPE = "_mtype__";
    public static final String BLOB_SIZE = "_size__";
}`
      );
      const result = mineBlobSuffixes(tmp);
      expect(result).to.deep.equal({
        fname: "_fname__",
        mtype: "_mtype__",
        size: "_size__",
      });
    } finally {
      await fs.remove(tmp).catch(() => {});
    }
  });

  it("mineAllImplicitFromDslCommons returns combined result when both files present", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "helium-miner-"));
    try {
      await fs.ensureDir(path.join(tmp, path.dirname(REL_BUILTIN)));
      await fs.ensureDir(path.join(tmp, path.dirname(REL_OBJECT_BUILDER)));
      await fs.writeFile(
        path.join(tmp, REL_BUILTIN),
        `public class BuiltinObjects {
    public static class Identity {
        public static final String ATTR_ID = "_id";
        public static final String ATTR_TIME_ZONE = "_timeZone";
    }
}`
      );
      await fs.writeFile(
        path.join(tmp, REL_OBJECT_BUILDER),
        `public class ObjectBuilder {
    public static final String ATTR_ID = "_id";
    public static final String BLOB_FILE_NAME = "_fname__";
    public static final String BLOB_MIME_TYPE = "_mtype__";
    public static final String BLOB_SIZE = "_size__";
}`
      );
      const result = mineAllImplicitFromDslCommons(tmp);
      expect(result).to.not.equal(null);
      expect(result!.roleImplicitFields).to.include("_id");
      expect(result!.roleImplicitFields).to.include("_timeZone");
      expect(result!.platformImplicitFields).to.deep.equal(["_id"]);
      expect(result!.blobSuffixes).to.deep.equal({
        fname: "_fname__",
        mtype: "_mtype__",
        size: "_size__",
      });
    } finally {
      await fs.remove(tmp).catch(() => {});
    }
  });

  it("returns null when BuiltinObjects.java is missing", () => {
    const tmp = path.join(os.tmpdir(), "helium-miner-nonexistent-" + Date.now());
    expect(mineRoleImplicitFields(tmp)).to.equal(null);
    expect(mineAllImplicitFromDslCommons(tmp)).to.equal(null);
  });

  it("returns null when ObjectBuilder.java is missing", () => {
    const tmp = path.join(os.tmpdir(), "helium-miner-nonexistent-" + Date.now());
    expect(minePlatformImplicitFields(tmp)).to.equal(null);
    expect(mineBlobSuffixes(tmp)).to.equal(null);
  });
});

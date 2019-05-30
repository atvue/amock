import paths from "../paths"
import fs from "fs-extra"

const { uploadDir } = paths


export default async () => {
    await fs.remove( uploadDir )
    await fs.ensureDir( uploadDir )
}
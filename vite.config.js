import { defineConfig } from "vite"
import { readFile } from "node:fs/promises"
import path from "node:path"

function viteValPlugin() {
  return {
    name: "vite-eval-plugin",
    async load(id) {
      if (!id.endsWith("foo.js")) return
      console.log("load", id)
      const { id: id2 } = await this.resolve("./foo.txt")
      this.addWatchFile(id2)
      console.log(this.getWatchFiles())
      const content1 = await readFile(id, "utf8")
      const content2 = await readFile(id2, "utf8")

      return `console.log(${JSON.stringify({ content1, content2 })})`
    },
  }
}

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.js'),
      name: 'YourLibraryName',
      fileName: (format) => `your-library-name.${format}.js`
    }
  },
  plugins: [
    viteValPlugin(),
  ],
})

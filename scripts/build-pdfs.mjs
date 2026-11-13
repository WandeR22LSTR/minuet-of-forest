// Renders each resume page from the built site into a PDF (/resume/ to dist/resume.pdf,
// /resume/jp/ to dist/resume-jp.pdf)
// using print media: selectable text, single column, live links.
import { serve } from "./serve.mjs";
import { launch } from "./browser.mjs";

const srv = await serve();
const browser = await launch();
try {
  for (const [route, name] of [["resume", "resume"], ["resume/jp", "resume-jp"]]) {
    const page = await browser.newPage();
    const res = await page.goto(`${srv.origin}${srv.base}/${route}/`, { waitUntil: "networkidle" });
    if (!res.ok()) throw new Error(`/${route}/ returned ${res.status()}`);
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: `dist/${name}.pdf`, format: "A4", printBackground: true, tagged: true, outline: true });
    console.log(`wrote dist/${name}.pdf`);
    await page.close();
  }
} finally {
  await browser.close();
  srv.close();
}

import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const { url, quality } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: quality || 'highest' });

    res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
    ytdl(url, { format }).pipe(res);
  } catch (err) {
    res.status(500).json({ error: "Download failed", details: err.message });
  }
}

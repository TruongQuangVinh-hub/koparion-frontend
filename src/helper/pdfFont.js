import regularFont from "../assets/fonts/Roboto-Regular.ttf"
import boldFont from "../assets/fonts/Roboto-Bold.ttf"

const loadFontFile = async (
  fontPath
) => {

  const response =
    await fetch(fontPath)

  const fontBlob =
    await response.arrayBuffer()

  let binary = ""

  const bytes =
    new Uint8Array(fontBlob)

  const length =
    bytes.byteLength

  for (
    let i = 0;
    i < length;
    i++
  ) {

    binary +=
      String.fromCharCode(
        bytes[i]
      )
  }

  return window.btoa(binary)
}

export const loadFont = async (
  doc
) => {

  // =========================
  // REGULAR FONT
  // =========================

  const regularBase64 =
    await loadFontFile(
      regularFont
    )

  doc.addFileToVFS(
    "Roboto-Regular.ttf",
    regularBase64
  )

  doc.addFont(
    "Roboto-Regular.ttf",
    "Roboto",
    "normal"
  )

  // =========================
  // BOLD FONT
  // =========================

  const boldBase64 =
    await loadFontFile(
      boldFont
    )

  doc.addFileToVFS(
    "Roboto-Bold.ttf",
    boldBase64
  )

  doc.addFont(
    "Roboto-Bold.ttf",
    "Roboto",
    "bold"
  )

  // DEFAULT FONT
  doc.setFont("Roboto")
}
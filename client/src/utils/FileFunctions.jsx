import { Buffer } from "buffer"

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const buffer = Buffer.from(b64Data, "base64")
    const blob = new Blob([buffer.buffer], { type: contentType, sliceSize })
    return blob
}

export default b64toBlob

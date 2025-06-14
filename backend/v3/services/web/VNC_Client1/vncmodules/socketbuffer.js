class SocketBuffer {
  constructor() {
    this.flush();
    this.colorSettings = {
      bitsPerPixel: 16,
      depth: 16,
      bigEndianFlag: 0,
      trueColorFlag: 1,
      redMax: 7936,
      greenMax: 16128,
      blueMax: 7936,
      redShift: 1.375,
      blueShift: 0,
      greenShift: 0.625,
    };
  }

  flush(keep = true) {
    if (keep && this.buffer?.length) {
      this.buffer = this.buffer.slice(this.offset);
      this.offset = 0;
    } else {
      this.buffer = new Buffer.from([]);
      this.offset = 0;
    }
  }

  toString() {
    return this.buffer.toString();
  }

  includes(check) {
    return this.buffer.includes(check);
  }

  pushData(data) {
    this.buffer = Buffer.concat([this.buffer, data]);
  }

  readInt32BE() {
    const data = this.buffer.readInt32BE(this.offset);
    this.offset += 4;
    return data;
  }

  readInt32LE() {
    const data = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return data;
  }

  readUInt32BE() {
    const data = this.buffer.readUInt32BE(this.offset);
    this.offset += 4;
    return data;
  }

  readUInt32LE() {
    const data = this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return data;
  }

  readUInt16BE() {
    const data = this.buffer.readUInt16BE(this.offset);
    this.offset += 2;
    return data;
  }

  readUInt16LE() {
    const data = this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return data;
  }

  readUInt8() {
    const data = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return data;
  }

  readInt8() {
    const data = this.buffer.readInt8(this.offset);
    this.offset += 1;
    return data;
  }

  readNBytes(bytes, offset = this.offset) {
    return this.buffer.slice(offset, offset + bytes);
  }

  readRgbPlusAlpha(red, green, blue) {
    const colorBuf = this.buffer.slice(this.offset, this.offset + 3);
    this.offset += 3;

    // const hex = colorBuf
    //   .slice(0, 1)
    //   .toString("hex")
    //   .concat(colorBuf.slice(1, 2).toString("hex"))
    //   .concat(colorBuf.slice(2, 3).toString("hex"));

    // const hexnot = `0x${hex}`;

    // // const alpha = (hexnot >> 24) & 0xff;
    // const blueValue = this.int2hex((hexnot >> 16) & 0xff);
    // const greenValue = this.int2hex((hexnot >> 8) & 0xff);
    // const redValue = this.int2hex((hexnot >> 0) & 0xff);

    // return Buffer.concat([
    //   new Buffer.from([`0x${redValue}`]),
    //   new Buffer.from([`0x${greenValue}`]),
    //   new Buffer.from([`0x${blueValue}`]),
    //   new Buffer.from([255]),
    // ]).readIntBE(0, 4);

    return red === 0 && green === 1 && blue === 2
      ? Buffer.concat([colorBuf, new Buffer.from([255])]).readIntBE(0, 4)
      : Buffer.concat([
          colorBuf.slice(red, red + 1),
          colorBuf.slice(green, green + 1),
          colorBuf.slice(blue, blue + 1),
          new Buffer.from([255]),
        ]).readIntBE(0, 4);
  }

  applyGammaCorrection(value, gamma = 2.2, channelShift = 1.0) {
    return Math.pow(value / 255, gamma) * 255 * channelShift;
  }

  reverseBits(buf) {
    for (let x = 0; x < buf.length; x++) {
      let newByte = 0;
      newByte += buf[x] & 128 ? 1 : 0;
      newByte += buf[x] & 64 ? 2 : 0;
      newByte += buf[x] & 32 ? 4 : 0;
      newByte += buf[x] & 16 ? 8 : 0;
      newByte += buf[x] & 8 ? 16 : 0;
      newByte += buf[x] & 4 ? 32 : 0;
      newByte += buf[x] & 2 ? 64 : 0;
      newByte += buf[x] & 1 ? 128 : 0;
      buf[x] = newByte;
    }
    return buf;
  }

  hex2bin(hex, length) {
    let inithex2bin = parseInt(hex, 16).toString(2).padStart(8, "0");
    while (inithex2bin.length < length) {
      inithex2bin = `0${inithex2bin}`;
    }
    return inithex2bin;
  }

  int2bin(int) {
    let initInt = int.toString(2);
    while (initInt.length < 16) {
      initInt = `0${initInt}`;
    }
    return initInt;
  }

  int2hex(int) {
    return int.toString(16);
  }

  bin2int(bin) {
    return parseInt(bin.toString(), 2);
  }

  reversebin(bin) {
    return bin.split("").reverse().join("");
  }

  readRgb16PlusAlpha(red, green, blue) {
    const colorBuf = this.buffer.slice(this.offset, this.offset + 2);
    this.offset += 2;

    const rgb565Value = colorBuf.readUInt16LE(0);

    const redValue = this.int2hex(Math.floor((rgb565Value >> 8) & 0xff));
    const greenValue = this.int2hex(Math.floor((rgb565Value >> 3) & 0xff));
    const blueValue = this.int2hex(Math.floor((rgb565Value << 3) & 0xff));

    return Buffer.concat([
      new Buffer.from([`0x${redValue}`]),
      new Buffer.from([`0x${greenValue}`]),
      new Buffer.from([`0x${blueValue}`]),
      new Buffer.from([255]),
    ]).readIntBE(0, 4);
  }

  readRgbColorMap(red, green, blue, redMax, greenMax, blueMax) {
    const colorBuf = this.buffer.slice(this.offset, this.offset + 6);
    this.offset += 6;
    const redBytes = colorBuf.slice(red * 2, red * 2 + 2);
    const greenBytes = colorBuf.slice(green * 2, green * 2 + 2);
    const blueBytes = colorBuf.slice(blue * 2, blue * 2 + 2);
    const redColor = Math.floor((redBytes.readUInt16BE() / redMax) * 255);
    const greenColor = Math.floor((greenBytes.readUInt16BE() / greenMax) * 255);
    const blueColor = Math.floor((blueBytes.readUInt16BE() / blueMax) * 255);
    return Buffer.concat([
      new Buffer.from(redColor),
      new Buffer.from(greenColor),
      new Buffer.from(blueColor),
      new Buffer.from([255]),
    ]).readIntBE(0, 4);
  }

  readRgba(red, green, blue) {
    // console.log(`red: ${red}, green: ${green}, blue: ${blue}`);
    if (red === 0 && green === 1 && blue === 2) {
      const data = this.buffer.readIntBE(this.offset, 4);
      this.offset += 4;
      return data;
    } else {
      const colorBuf = this.buffer.slice(this.offset, this.offset + 4);
      this.offset += 4;
      return Buffer.concat([
        colorBuf.slice(red, red + 1),
        colorBuf.slice(green, green + 1),
        colorBuf.slice(blue, blue + 1),
        colorBuf.slice(3, 4),
      ]).readIntBE(0, 4);
    }
  }

  readNBytesOffset(bytes) {
    const data = this.buffer.slice(this.offset, this.offset + bytes);
    this.offset += bytes;
    return data;
  }

  setOffset(n) {
    this.offset = n;
  }

  bytesLeft() {
    return this.buffer.length - this.offset;
  }

  async waitBytes(bytes, name) {
    if (this.bytesLeft() >= bytes) {
      return;
    }
    let counter = 0;
    while (this.bytesLeft() < bytes) {
      counter++;
      // console.log('Esperando. BytesLeft: ' + this.bytesLeft() + '  Desejados: ' + bytes);
      await this.sleep(4);
      if (counter === 100) {
        console.log(
          `Stucked on ${name}  -  Buffer Size: ${
            // eslint-disable-line no-console
            this.buffer.length
          }   BytesLeft: ${this.bytesLeft()}   BytesNeeded: ${bytes}`
        );
      }
    }
  }

  fill(data) {
    this.buffer.fill(data, this.offset, this.offset + data.length);
    this.offset += data.length;
  }

  fillMultiple(data, repeats) {
    this.buffer.fill(data, this.offset, this.offset + data.length * repeats);
    this.offset += data.length * repeats;
  }

  sleep(n) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, n);
    });
  }
}

module.exports = SocketBuffer;

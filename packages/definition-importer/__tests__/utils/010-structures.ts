import * as fs from "fs";

// @ts-ignore
import * as gunzip from "gunzip-maybe";
import { each, find, join } from "lodash";
import * as tar from "tar-stream";

const structureFolder = `${__dirname}/../../__fixtures__/`;

async function getArchiveEntries(filename: string) {
  const readStream = fs.createReadStream(`${structureFolder}/${filename}`);
  return new Promise<any[]>((resolve) => {
    const extract = tar.extract();
    const entries: any[] = [];
    extract.on("entry", (header, stream, next) => {
      const chunks: string[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.once("end", () => {
        const buffer = join(chunks, "");
        entries.push({
          name: header.name,
          content: buffer,
        });
        next();
      });
      stream.resume();
    });
    extract.on("finish", () => {
      resolve(entries);
    });
    readStream.pipe(gunzip()).pipe(extract);
  });
}

const SCRIPT_NAMES = [
  "AlpineAPN.1sc",
  "ArrayOfStrings.1sc",
  "BatchChecksum.1sc",
  "BinToI_IToBin.1sc",
  "BracketMatch.1sc",
  "CmpLines.1sc",
  "ConvertBytesToInts.1sc",
  "CopyAsAsm.1sc",
  "CopyAsBinary.1sc",
  "CopyAsCpp.1sc",
  "CopyAsHex.1sc",
  "CopyAsPascal.1sc",
  "CopyAsPython.1sc",
  // "CountBlocks.1sc", Contains a parsing error...
  "CreateMassData.1sc",
  "CSVDeleteColumn.1sc",
  "DecodeBase64.1sc",
  "DelColumn.1sc",
  "DeleteEmptyLines.1sc",
  "DexFixer.1sc",
  "DumpStrings.1sc",
  "EbookClean.1sc",
  "EncodeBase64.1sc",
  "Entropy.1sc",
  "FindAllClipboardBytes.1sc",
  "Find_and_Bookmark.1sc",
  "FindBookmarksNearCursor.1sc",
  "FindClipboardBytes.1sc",
  "Find_Diff_Down.1sc",
  "Find_Diff_Down_RE.1sc",
  "Find_Diff_Up.1sc",
  "Find_Diff_Up_RE.1sc",
  "FindLongLines.1sc",
  "Fuzzer.1sc",
  "GetFileIndexOrName.1sc",
  "GUID.1sc",
  "HexToAsciiString.1sc",
  "ImportBookmarksCSV.1sc",
  "ImportFindAllCSV.1sc",
  "InsertTiffTag.1sc",
  "Interleave.1sc",
  "IsASCII.1sc",
  "JoinFile.1sc",
  "Js-unicode-escape.1sc",
  "Js-unicode-unescape.1sc",
  "MultiplePaste.1sc",
  "NibblesReverse.1sc",
  "ParseCSV.1sc",
  "Patchmaker.1sc",
  "QuickSort.1sc",
  "QuickSort2.1sc",
  "Randomize.1sc",
  "RecordSearch.1sc",
  "RemoveFromStartToCurrentPosition.1sc",
  "Rot-13.1sc",
  "SectorSearch.1sc",
  "SelToLowerASCII.1sc",
  "SelToULowerASCII.1sc",
  "SelToUpperASCII.1sc",
  "SimpleEncoder.1sc",
  "SortLines.1sc",
  "SplitFile.1sc",
  "StringPlus.1sc",
  "StringReplace.1sc",
  "StringReverse.1sc",
  "sWeEtSCApE.1sc",
  "TruncateFileFromCurrentPosition.1sc",
  "Uninterleave.1sc",
  "URLDecoder.1sc",
  "XORSelection.1sc",
  "XORSelectionHex.1sc",
  "XORStringBruteForce.1sc",
];

const STRUCTURE_NAMES = [
  "010.bt",
  "010Theme.bt",
  "7ZIP.bt",
  "ADF.bt",
  "AndroidManifest.bt",
  "AndroidResource.bt",
  "AndroidTrace.bt",
  "AndroidVBMeta.bt",
  "AVI.bt",
  "BaseMedia.bt",
  "Bash.bt",
  "Batch.bt",
  "BMP.bt",
  "BPlist.bt",
  "BSON.bt",
  "CAB.bt",
  "CAP.bt",
  "CDA.bt",
  "CLASSAdv.bt",
  "CLASS.bt",
  "CPP.bt",
  "CRX.bt",
  "Cryptfs.bt",
  "CSharp.bt",
  "CSS.bt",
  "DBF.bt",
  "DDS.bt",
  "DEX.bt",
  "DMP.bt",
  "Drive.bt",
  "EatonAPR48.bt",
  "EDID.bt",
  "ELF.bt",
  "ElTorito.bt",
  "EMF.bt",
  "EOT.bt",
  "EVSB.bt",
  "EXE.bt",
  "EZTap_EZVIEW2.bt",
  "FLV.bt",
  "FNT.bt",
  "FTS.bt",
  "GGPK.bt",
  "GIF.bt",
  "Goclever.bt",
  "GZip.bt",
  "HFSJournal.bt",
  "HiewCMarkers.bt",
  "HTML.bt",
  "ICO.bt",
  "IGI2_RES.bt",
  "IGI2_SPR.bt",
  "IGI2_TEX.bt",
  "IGI2_THM.bt",
  "IGI2_TLM.bt",
  "IGI2_TMM.bt",
  "IGI2_WAV.bt",
  "iNes.bt",
  "InspectorDates.bt",
  "InspectorWithMP4DateTime.bt",
  "ISO.bt",
  "Java.bt",
  "JavaScript.bt",
  "JPG.bt",
  "KryoFlux.bt",
  "LNK.bt",
  "Luac.bt",
  "LuaJIT.bt",
  "LUKS.bt",
  "LZ4.bt",
  "MachO.bt",
  "MFT.bt",
  "MIDI.bt",
  "Mifare1k.bt",
  "Mifare4k.bt",
  "MifareUltralight.bt",
  "MOBI.bt",
  "Modo.bt",
  "MongoDBWireProtocol.bt",
  "MP3.bt",
  "MP4.bt",
  "MXF.bt",
  "NDS.bt",
  "NetflowVersion5.bt",
  "NTAG215.bt",
  "Nus3Audio.bt",
  "OGG.bt",
  "OPCache.bt",
  "OpenType.bt",
  "OrCAD_LIB.bt",
  "OrCAD_SCH.bt",
  "OscarItem.bt",
  "PAL.bt",
  "PCAP.bt",
  "PCAPNG.bt",
  "PCX.bt",
  "PDF.bt",
  "PHP.bt",
  "Picolog_PLW.bt",
  "PNG.bt",
  "PowerShell.bt",
  "PSF.bt",
  "PYC.bt",
  "Python.bt",
  "Quake3Arena_BSP.bt",
  "Quake3Arena_MD3.bt",
  "RAR.bt",
  "RDB.bt",
  "RegistryDhcpInterfaceOptions.bt",
  "RegistryHive.bt",
  "RegistryPolicyFile.bt",
  "RES.bt",
  "RIFF.bt",
  "RM.bt",
  "ROMFS.bt",
  "SCP.bt",
  "SeqBox.bt",
  "SF2.bt",
  "SHP.bt",
  "ShpcAnim.bt",
  "SHX.bt",
  "SinclairMicrodrive.bt",
  "SQL.bt",
  "SquashFS.bt",
  "SRec.bt",
  "SSP.bt",
  "STL.bt",
  "SWF.bt",
  "SytosPlus.bt",
  "Tacx.bt",
  "TGA.bt",
  "ThumbCache.bt",
  "TIF.bt",
  "TNEF.bt",
  "TOC.bt",
  "Torrent.bt",
  "TTF.bt",
  "ULP.bt",
  "UTMP.bt",
  "VB.bt",
  "VHD.bt",
  "WASM.bt",
  "WAVAdv.bt",
  "WAV.bt",
  "WinhexPos.bt",
  "WMF.bt",
  "XML.bt",
  "ZIPAdv.bt",
  "ZIP.bt",
];

export class AssetLoader {
  private scripts: any[] = [];
  private structures: any[] = [];

  public constructor() {}

  public load() {
    const loader = this;
    return async function(done: () => void) {
      loader.scripts = await getArchiveEntries("010-scripts.tar.gz");
      loader.structures = await getArchiveEntries("010-structures.tar.gz");
      done();
    };
  }

  public getSingleStructure(name: string) {
    return fs.readFileSync(`${structureFolder}/${name}.bt`, "UTF-8");
  }

  public iterateElements(
    iteratee: (
      categoryType: string,
      elementName: string,
      getter: () => { name: string; content: string },
    ) => void,
  ) {
    const loader = this;
    each(
      [
        { type: "script", names: SCRIPT_NAMES, load: () => loader.scripts },
        { type: "structure", names: STRUCTURE_NAMES, load: () => loader.structures },
      ],
      (category) => {
        each(category.names, (elementName) => {
          iteratee(category.type, elementName, () => find(category.load(), (e) => e.name === elementName));
        });
      },
    );
    return undefined;
  }
}

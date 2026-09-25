// AUTO-GENERATED from backend/src/data/verso-dataset/C_images/countries.
// Licensing per C_images/credits.csv (Wikimedia Commons, CC BY / CC BY-SA,
// author and source URL on file) — one photograph per country, real and
// verified, matching the same editorial standard Location.img already
// holds Uzbek places to ("a photograph of the wrong monument is worse
// than no photograph: it is a factual claim, made confidently, and wrong").
import AE from "./ae.webp";
import AM from "./am.webp";
import AR from "./ar.webp";
import AT from "./at.webp";
import AU from "./au.webp";
import AZ from "./az.webp";
import BR from "./br.webp";
import CH from "./ch.webp";
import CN from "./cn.webp";
import CO from "./co.webp";
import CZ from "./cz.webp";
import DE from "./de.webp";
import EG from "./eg.webp";
import ES from "./es.webp";
import FR from "./fr.webp";
import GB from "./gb.webp";
import GE from "./ge.webp";
import GR from "./gr.webp";
import HR from "./hr.webp";
import HU from "./hu.webp";
import ID from "./id.webp";
import IN from "./in.webp";
import IS from "./is.webp";
import IT from "./it.webp";
import JP from "./jp.webp";
import KE from "./ke.webp";
import KG from "./kg.webp";
import KZ from "./kz.webp";
import MA from "./ma.webp";
import MX from "./mx.webp";
import MY from "./my.webp";
import NL from "./nl.webp";
import NO from "./no.webp";
import NZ from "./nz.webp";
import PE from "./pe.webp";
import PL from "./pl.webp";
import PT from "./pt.webp";
import SE from "./se.webp";
import SG from "./sg.webp";
import TH from "./th.webp";
import TR from "./tr.webp";
import US from "./us.webp";
import UZ from "./uz.webp";
import VN from "./vn.webp";
import ZA from "./za.webp";
// The 6 countries the original dataset fetch never reached (see countries.ts) —
// sourced separately, same standard: one real, licensed, landscape photograph
// of a recognisable landmark, straight from Wikimedia Commons.
import CL from "./cl.jpg";
import IE from "./ie.jpg";
import JO from "./jo.jpg";
import KR from "./kr.jpg";
import LK from "./lk.jpg";
import TZ from "./tz.jpg";

/** ISO 3166-1 alpha-2 → photograph. Every country in COUNTRIES has one —
 *  the last 6 (CL, IE, JO, KR, LK, TZ) were added after the original
 *  dataset fetch, which never reached them. `Partial` stays as the type
 *  regardless: a lookup by a code from outside COUNTRIES (typo, future
 *  removal) must still fall back to the plate wash, not throw. */
export const COUNTRY_IMAGES: Partial<Record<string, string>> = {
  AE,
  AM,
  AR,
  AT,
  AU,
  AZ,
  BR,
  CH,
  CN,
  CO,
  CZ,
  DE,
  EG,
  ES,
  FR,
  GB,
  GE,
  GR,
  HR,
  HU,
  ID,
  IN,
  IS,
  IT,
  JP,
  KE,
  KG,
  KZ,
  MA,
  MX,
  MY,
  NL,
  NO,
  NZ,
  PE,
  PL,
  PT,
  SE,
  SG,
  TH,
  TR,
  US,
  UZ,
  VN,
  ZA,
  CL,
  IE,
  JO,
  KR,
  LK,
  TZ,
};

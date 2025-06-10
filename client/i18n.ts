import { i18n } from 'next-i18next'

export function t(key: string | TemplateStringsArray | (string | TemplateStringsArray)[]){
  const t = i18n?.t;
  return t ? t(key) : Array.isArray(key) ? key.toString() : key;
}

export function tContainer(){
  return t;
}
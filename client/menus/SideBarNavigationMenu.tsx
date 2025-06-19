import { GRANT } from "@/acl/types";
import { IMenu } from "../types";
import { NavButton } from "@/components/layout/SearchFilters";
import { useTranslation } from "next-i18next";

function NavButtonWrapper({href,label}:{href:string,label:string}){
  const {t} = useTranslation('common');
  return <NavButton href={href}>{t(label)}</NavButton>
}

export const SideBarnavigationMenu:IMenu = {
  "NavigationMenu/Main":{
    grant: GRANT.READ,
    label: 'main',
    url: '/',
    component: <NavButtonWrapper href='/' label="Main"/>
  },
  "NavigationMenu/Classes":{
    grant: GRANT.WRITE,
    label:'Classes',
    url: '/classes',
    component: <NavButtonWrapper href='/classes' label="classes"/>
  },
  "NavigationMenu/Diary":{
    grant: GRANT.READ,
    label:'diary',
    url: '/diary',
    component: <NavButtonWrapper href='/diary' label="diary"/>
  },
  "NavigationMenu/Admin":{
    grant: GRANT.EXECUTE,
    label:'admin',
    url: '/admin',
    component: <NavButtonWrapper href='/admin' label="admin"/>
  },
  "NavigationMenu/Pager":{
    grant: GRANT.READ,
    label:'Pager',
    url: '/pager',
    component: <NavButtonWrapper href='/pager' label="Pager"/>
  },
  "NavigationMenu/Table":{
    grant: GRANT.READ,
    label:'Table',
    url: '/table',
    component: <NavButtonWrapper href='/table' label="Table"/>
  },
}
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, C } from '../lib/content';
import { SITE_IMAGES } from '../lib/images';
import { useLang } from './LangProvider';

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLang();
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const open = (name) => window.dispatchEvent(new CustomEvent('rx-modal', { detail: name }));

  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src={SITE_IMAGES.logoWhite} alt="TOP MARINE GROUP" />
      </div>

      <div className="footer-content">
        <div className="row gx-0">
          <div className="col-sm-3">
            <ul className="footer-menu">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={isActive(n.href) ? 'active' : ''}>{n[lang]}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-sm-13 d-flex flex-md-row flex-column align-items-md-center align-items-sm-end align-items-center justify-content-end mt-sm-0 mt-10">
            <ul className="socials">
              <li>
                <a href="https://sg.linkedin.com/" target="_blank" rel="noreferrer">
                  <i className="icon-linkedin"></i>
                </a>
              </li>
            </ul>

            <hr className="vertical large mx-lg-6 mx-3 d-md-block d-none" />
            <hr className="large my-3 me-sm-0 d-md-none" />

            <div className="mw-200 text-md-start text-sm-end text-center">
              <p className="small text-white fw-bold">{C.footer.address[lang]}</p>
              <a href={`mailto:${C.contact.email}`} className="link-white fw-bold d-block mt-4">{C.contact.email}</a>
            </div>
          </div>

          <div className="col-md-8 mt-10">
            <ul className="terms-menu">
              <li><button type="button" onClick={() => open('policy')}>{C.footer.policy[lang]}</button></li>
              <li><button type="button" onClick={() => open('cookies')}>{C.footer.settings[lang]}</button></li>
            </ul>
          </div>

          <div className="col-md-8 mt-md-10 mt-5">
            <p className="copyrights"><span>{C.footer.rights[lang]}</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

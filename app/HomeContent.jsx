'use client';
import Link from 'next/link';
import { SERVICES, C } from './lib/content';
import { SERVICE_ICONS, SITE_IMAGES } from './lib/images';
import { useLang } from './components/LangProvider';

export default function Home() {
  const { lang } = useLang();
  const h = C.home;
  return (
    <div className="content-wrapper home-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-16">
            <div className="position-relative">
              <div className="ratio ratio-home-hero">
                <div className="hero-split">
                  <div style={{ backgroundImage: `url(${SITE_IMAGES.home.leftHero})` }} title="containership" />
                  <div style={{ backgroundImage: `url(${SITE_IMAGES.home.rightHero})`, backgroundPosition: 'center 42%' }} title="oil tanker" />
                </div>
              </div>
              <div className="grad-overlay home-grad"></div>
              <div className="home-hero-text">
                <h1><p style={{ fontSize: '45px' }}>{h.h1[lang][0]}<br /> {h.h1[lang][1]}</p></h1>
                <br />
                <h2><span style={{ color: '#766E6E' }}>{h.sub[lang]}</span></h2>
                <br />
                <Link href="/about">
                  <span>{h.more[lang]}</span>{' '}
                  <span style={{ color: '#766E6E' }}><i className="icon-arrow-right"></i></span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-md-15 mt-sm-7 mt-5 home-services-row">
          <div className="col-md-15">
            <ul className="home-services">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={`/services#${s.id}`}>
                    <img src={SERVICE_ICONS[s.id]} className="home-service-icon" alt={s.title[lang]} />
                    <p className="home-service-title">{s.title[lang]} <i className="icon-arrow-right"></i></p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

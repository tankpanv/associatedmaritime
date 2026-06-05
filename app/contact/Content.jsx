'use client';
import { useState } from 'react';
import { C } from '../lib/content';
import { SITE_IMAGES } from '../lib/images';
import { useLang } from '../components/LangProvider';

export default function Contact() {
  const { lang } = useLang();
  const c = C.contact;
  const [active, setActive] = useState('sg');
  const office = c.offices.find((o) => o.key === active);
  const mapHelp = {
    en: 'If the embedded map is slow to load on your network, use the map links below.',
    zh: '如果当前网络下嵌入地图加载较慢，可使用下方地图链接打开。',
  };

  return (
    <div className="content-wrapper">
      <div className="container-fluid mt-xxl-15 mt-xl-4 mt-lg-8 mt-sm-5 mb-sm-20 mb-15">
        <div className="row justify-content-center">
          <div className="col-xxl-13 col-xl-14 col-lg-15 col-md-16 col-sm-15 text-block">
            <div className="row">
              <div className="col-16">
                <h1 className="page-title mask-bottom">
                  {c.title[lang].map((w, i) => <span key={i}>{w}</span>).reduce((prev, cur) => [prev, ' ', cur])}<i></i>
                </h1>
              </div>
            </div>

            <div className="row mt-sm-10 mt-6">
              <div className="col-16">
                <div className="d-flex flex-md-row flex-column reveal">
                  <div className="contact-left-panel">
                    <img src={SITE_IMAGES.contact.logo} className="contact-main-logo" alt="TOP MARINE GROUP" />
                    <div className="vertical-tabs mt-sm-8 mt-5" role="tablist" aria-orientation="vertical">
                      {c.offices.map((o) => (
                        <button key={o.key} type="button" className={active === o.key ? 'active' : ''}
                          onClick={() => setActive(o.key)}>
                          {o.tab[lang]} <i className="icon-arrow-right"></i>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="tab-content ms-xxl-18 ms-xl-15 ms-lg-10 ms-md-5 mt-md-0 mt-6">
                    <div className="tab-pane fade text-md-start text-center show active">
                      <p className="xxlarge ff-sans-serif-2 fw-bold">{office.title[lang]}</p>
                      <p className="xxlarge ff-sans-serif-2 fw-bold text-dove mt-2">{office.place[lang]}</p>
                      <p className="large fw-light mt-3">{office.address[lang]}</p>
                      <ul className="no-style mt-4">
                        <li className="mt-3">
                          <a href={`mailto:${c.email}`} className="link-primary ff-sans-serif-2 d-inline-flex align-items-center">
                            <i className="icon-envelope icon-xs"></i> <span className="large fw-bold ms-2">{c.email}</span>
                          </a>
                        </li>
                      </ul>
                      <div className="ratio ratio-24x17 w-480 img-fluid mx-auto mt-5">
                        <iframe key={office.key + lang} src={office.map.embed} width="600" height="450" style={{ border: 0 }}
                          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={office.place.en}></iframe>
                      </div>
                      <p className="small text-dove mt-3">{mapHelp[lang]}</p>
                      <div className="d-flex flex-wrap justify-content-md-start justify-content-center gap-3 mt-3">
                        <a href={office.map.link} target="_blank" rel="noreferrer" className="btn btn-outline-primary">
                          {lang === 'zh' ? '打开 OpenStreetMap' : 'Open in OpenStreetMap'}
                        </a>
                        {office.map.google && (
                          <a href={office.map.google} target="_blank" rel="noreferrer" className="btn btn-outline-primary">
                            {lang === 'zh' ? '打开 Google 地图' : 'Open in Google Maps'}
                          </a>
                        )}
                        {office.map.amap && (
                          <a href={office.map.amap} target="_blank" rel="noreferrer" className="btn btn-outline-primary">
                            {lang === 'zh' ? '打开高德地图' : 'Open in Amap'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { SERVICES } from '../lib/content';
import { SERVICE_IMAGES } from '../lib/images';
import { useLang } from '../components/LangProvider';

export default function Services() {
  const { lang } = useLang();
  return (
    <div className="content-wrapper">
      <div className="container-fluid mt-xxl-15 mt-xl-4 mt-lg-8 mt-sm-5 mb-sm-20 mb-15">
        <div className="row justify-content-center">
          <div className="col-xxl-13 col-xl-15 col-lg-16 col-md-15 col-16">
            <h1 className="page-title">{lang === 'zh' ? '服务' : 'Services'} <i></i></h1>
            <ul className="services mt-5">
              {SERVICES.map((s) => (
                <li key={s.id} id={s.id} data-section={s.id}>
                  <div className="service-text">
                    <div className="service-index"><span></span></div>
                    <div className="service-title"><h2>{s.title[lang]}</h2><span></span></div>
                    <div className="service-desc">
                      {s.body[lang].map((p, i) => <p key={i}>{p}</p>)}
                      {s.list && <ul>{s.list[lang].map((li) => <li key={li}>{li}</li>)}</ul>}
                    </div>
                  </div>
                  <div className="service-image">
                    <div className="bg-fill" style={{ backgroundImage: `url(${SERVICE_IMAGES[s.id]})` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

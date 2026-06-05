'use client';
import { C } from '../lib/content';
import { SITE_IMAGES } from '../lib/images';
import { useLang } from '../components/LangProvider';

export default function Fleet() {
  const { lang } = useLang();
  const f = C.fleet;
  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-16">
            <div className="position-relative">
              <div className="ratio ratio-home-hero">
                <div className="bg-fill" style={{ backgroundImage: `url(${SITE_IMAGES.fleet.hero})` }} />
              </div>
              <div className="grad-overlay fleet-grad"></div>
              <div className="home-hero-text">
                {Array.from({ length: 10 }).map((_, i) => <br key={i} />)}
                <h1><span><u>{f.title[lang]}</u></span> <i></i></h1>
                <div className="fleet-text">
                  <br />
                  <h2><strong>{f.h2a[lang]}</strong>{f.h2b[lang]}</h2>
                  <div>
                    <br />
                    <p className="large lh-lg text-md-justify text-center">{f.p1[lang]}</p>
                    <p className="large lh-lg text-md-justify text-center">{f.p2[lang]}</p>
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

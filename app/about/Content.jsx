'use client';
import { C } from '../lib/content';
import { SITE_IMAGES } from '../lib/images';
import { useLang } from '../components/LangProvider';

export default function About() {
  const { lang } = useLang();
  const a = C.about;
  const sp = (arr) => arr[lang].map((w, i) => <span key={i}>{w}</span>).reduce((p, c) => [p, ' ', c]);

  return (
    <div className="content-wrapper">
      <div className="container-fluid mt-xxl-15 mt-xl-4 mt-lg-8 mt-sm-5 mb-sm-20 mb-15">
        <div className="row justify-content-center">
          <div className="col-md-15 col-16">

            <div className="row justify-content-lg-end justify-content-center">
              <div className="col-lg-7 text-lg-end text-md-center">
                <div className="d-inline-block text-start me-xl-10 me-lg-1 text-block">
                  <p className="page-title mask-bottom"><span>{a.title[lang]}</span> <i></i></p>
                  <div className="mw-600 mt-4 reveal">
                    <h1 className="h4 d-inline">{a.intro1[lang]}</h1>
                    <h2 className="h4 d-inline text-dove ms-1">{a.intro2[lang]}</h2>
                    <p className="large fw-light lh-lg mt-5">{a.p1[lang]}</p>
                    <p className="large fw-light lh-lg">{a.p2[lang]}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12 position-relative mt-lg-0 mt-5">
                <div className="ratio ratio-48x35 h-100">
                  <div className="bg-fill" style={{ backgroundImage: `url(${SITE_IMAGES.about.intro})` }} />
                </div>
                <div className="grad-overlay bottom"></div>
              </div>
            </div>

            <div className="row mt-xxl-8 mt-xl-10 z-1 text-block">
              <div className="col-16 text-center">
                <p className="h1 mw-350 mx-auto mask-bottom">{sp(a.includeTitle)}</p>
              </div>
              <div className="col-16 d-flex justify-content-center mt-5">
                <ul className="checklist reveal">
                  {a.checklist1[lang].map((x) => <li key={x}>{x}</li>)}
                </ul>
                <hr className="vertical h-0 primary opacity-50 mx-sm-6 mx-3" />
                <ul className="checklist reveal">
                  {a.checklist2[lang].map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            </div>

            <div className="row justify-content-lg-end justify-content-center mt-lg-15 mt-md-10 mt-5">
              <div className="col-lg-7 text-lg-end text-md-center mb-xxl-20">
                <div className="d-inline-block text-start me-xl-10 me-lg-1 text-block">
                  <p className="page-title mask-bottom">{sp(a.whyTitle)}</p>
                  <div className="mw-600 mt-4 reveal">
                    {a.why[lang].map((p, i) => <p key={i} className="large fw-light lh-lg">{p}</p>)}
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12 position-relative mt-lg-0 mt-5">
                <div className="ratio ratio-48x35 h-100">
                  <div className="bg-fill" style={{ backgroundImage: `url(${SITE_IMAGES.about.why})` }} />
                </div>
                <div className="grad-overlay bottom"></div>
              </div>
            </div>

            <div className="row mt-xxl-n15 mt-md-10 mt-sm-n10 mt-n3 z-1">
              <div className="col-sm-8">
                <div className="mw-380 ms-sm-auto text-block">
                  <p className="display-3 fw-bold mask-bottom">{sp(a.visionTitle)}</p>
                  <div className="reveal"><p className="large fw-light lh-lg">{a.vision[lang]}</p></div>
                </div>
              </div>
              <div className="col-sm-8 mt-sm-0 mt-5">
                <div className="mw-380 text-block">
                  <p className="display-3 fw-bold mask-bottom">{sp(a.missionTitle)}</p>
                  <div className="reveal"><p className="large fw-light lh-lg">{a.mission[lang]}</p></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

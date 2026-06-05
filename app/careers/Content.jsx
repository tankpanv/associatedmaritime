'use client';
import CareerForm from '../components/CareerForm';
import { C } from '../lib/content';
import { SITE_IMAGES } from '../lib/images';
import { useLang } from '../components/LangProvider';

export default function Careers() {
  const { lang } = useLang();
  const c = C.careers;
  return (
    <div className="content-wrapper">
      <div className="container-fluid mt-xxl-15 mt-xl-4 mt-lg-8 mt-sm-5 mb-sm-20 mb-15">
        <div className="row justify-content-center">
          <div className="col-xxl-13 col-sm-15 text-block">
            <div className="row">
              <div className="col-16">
                <h1 className="page-title mask-bottom"><span>{c.title[lang]}</span> <i></i></h1>
              </div>
            </div>
            <div className="row justify-content-center mt-sm-10 mt-5">
              <div className="col-xl-5 col-md-8 order-md-1">
                <div className="text-start mw-430 reveal">
                  <h2 className="h4 d-inline">{c.lead1[lang]}</h2>
                  <p className="h4 d-inline">{c.lead2[lang]}</p>
                  <p className="large fw-light mt-sm-6 mt-3">{c.p1[lang]}</p>
                  <p className="large fw-light mt-3">{c.p2[lang]}</p>
                </div>
              </div>

              <div className="col-xxl-4 col-xl-5 col-lg-9 col-md-13 order-xl-2 order-md-3 mt-xl-0 mt-md-6 mt-4 reveal">
                <div><CareerForm /></div>
              </div>

              <div className="col-xl-6 col-md-8 order-xl-2 order-md-2 offset-xxl-1 mt-md-n15 mt-5">
                <div className="ratio ratio-careers">
                  <div className="bg-fill" style={{ backgroundImage: `url(${SITE_IMAGES.careers.hero})` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

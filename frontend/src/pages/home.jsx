import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Home() {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    api.get('/courses').then(({ data }) => setCourses(data)).catch(() => setCourses(null));
  }, []);

  const total = courses ? courses.length : '—';
  const credits = courses ? courses.reduce((sum, c) => sum + c.credits, 0) : '—';
  const semesters = courses ? new Set(courses.map((c) => c.semester)).size : '—';

  return (
    <>
      <section className="hero-card">
        <div>
          <h1>Every course in your department, in one place.</h1>
          <p>
            Add courses, look one up by its code, correct the details, or remove it when it is
            no longer offered.
          </p>
          <Link to="/manage" className="btn btn-primary btn-lg">
            <i className="bi bi-table me-2" />Manage courses
          </Link>
        </div>
        <div className="hero-icon"><i className="bi bi-journal-bookmark-fill" /></div>
      </section>

      <section className="row g-3 mb-4">
        {[
          { icon: 'bi-collection', value: total, label: 'Courses on record' },
          { icon: 'bi-award', value: credits, label: 'Total credits' },
          { icon: 'bi-calendar3', value: semesters, label: 'Semesters covered' },
        ].map((s) => (
          <div className="col-md-4" key={s.label}>
            <div className="panel stat">
              <div className="stat-icon"><i className={`bi ${s.icon}`} /></div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="row g-3">
        {[
          { icon: 'bi-plus-circle', title: 'Add courses', text: 'Enter the name, code, credits and semester in one short form.' },
          { icon: 'bi-search', title: 'Find by code', text: 'Type part of a code like CS3 to narrow the table.' },
          { icon: 'bi-shield-check', title: 'Checked entries', text: 'Codes, credits and semesters are validated before saving.' },
        ].map((f) => (
          <div className="col-md-4" key={f.title}>
            <div className="panel feature">
              <i className={`bi ${f.icon}`} />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
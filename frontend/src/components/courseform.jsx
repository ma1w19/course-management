const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function CourseForm({ values, errors, editing, saving, onChange, onSubmit, onCancel }) {
  const field = (name) => ({
    name,
    value: values[name],
    onChange,
    className: `form-control ${errors[name] ? 'is-invalid' : ''}`,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="panel form-panel">
      <div className="panel-head">
        <h2 className="panel-title">
          <i className={`bi ${editing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2 text-secondary`} />
          {editing ? 'Update course' : 'Add a course'}
        </h2>
      </div>

      <div className="p-3 p-md-4">
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="course_name">Course name</label>
            <input id="course_name" type="text" placeholder="Data Structures" {...field('course_name')} />
            <div className="invalid-feedback">{errors.course_name}</div>
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="course_code">Course code</label>
            <input id="course_code" type="text" placeholder="CS301" {...field('course_code')} />
            <div className="invalid-feedback">{errors.course_code}</div>
            {!errors.course_code && <div className="form-text">2–4 letters followed by 3 digits.</div>}
          </div>

          <div className="col-6">
            <label className="form-label" htmlFor="credits">Credits</label>
            <input id="credits" type="number" min="1" max="6" placeholder="1 to 6" {...field('credits')} />
            <div className="invalid-feedback">{errors.credits}</div>
          </div>

          <div className="col-6">
            <label className="form-label" htmlFor="semester">Semester</label>
            <select id="semester" {...field('semester')} className={`form-select ${errors.semester ? 'is-invalid' : ''}`}>
              <option value="">Select</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
            <div className="invalid-feedback">{errors.semester}</div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary flex-grow-1" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add course'}
          </button>
          {editing && (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
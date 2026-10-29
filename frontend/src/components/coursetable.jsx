export default function CourseTable({ courses, loading, searching, onEdit, onDelete }) {
  if (loading)
    return (
      <div className="empty">
        <div className="spinner-border spinner-border-sm text-secondary mb-2" role="status" />
        <div>Loading courses…</div>
      </div>
    );

  if (courses.length === 0)
    return (
      <div className="empty">
        <i className={`bi ${searching ? 'bi-search' : 'bi-journal-plus'}`} />
        {searching ? 'No course matches that code.' : 'No courses yet. Add the first one using the form.'}
      </div>
    );

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="d-none d-md-table-cell">ID</th>
            <th>Code</th>
            <th>Course name</th>
            <th>Credits</th>
            <th>Semester</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td className="text-secondary d-none d-md-table-cell">{c.id}</td>
              <td><span className="code-chip">{c.course_code}</span></td>
              <td className="fw-medium">{c.course_name}</td>
              <td><span className="badge-soft">{c.credits} cr</span></td>
              <td><span className="badge-soft">Sem {c.semester}</span></td>
              <td className="text-end text-nowrap">
                <button className="btn btn-sm btn-outline-primary icon-btn me-1" title="Edit" onClick={() => onEdit(c)}>
                  <i className="bi bi-pencil" />
                </button>
                <button className="btn btn-sm btn-outline-danger icon-btn" title="Delete" onClick={() => onDelete(c)}>
                  <i className="bi bi-trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
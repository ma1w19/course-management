import { useCallback, useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '../api';
import { validateCourse } from '../validation';
import CourseForm from '../components/CourseForm.jsx';
import CourseTable from '../components/CourseTable.jsx';

const EMPTY = { course_name: '', course_code: '', credits: '', semester: '' };

const ALERT_ICONS = {
  success: 'bi-check-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  danger: 'bi-x-octagon-fill',
};

export default function Management() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const formRef = useRef(null);

  const loadCourses = useCallback(async (code = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/courses', { params: code ? { code } : {} });
      setCourses(data);
    } catch (err) {
      setAlert({ type: 'danger', text: errorMessage(err, 'Could not load courses.') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const resetForm = () => {
    setValues(EMPTY);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateCourse(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setAlert({ type: 'warning', text: 'Please fix the highlighted fields.' });
      return;
    }

    const payload = {
      course_name: values.course_name.trim(),
      course_code: values.course_code.trim().toUpperCase(),
      credits: Number(values.credits),
      semester: Number(values.semester),
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        setAlert({ type: 'success', text: `${payload.course_code} was updated.` });
      } else {
        await api.post('/courses', payload);
        setAlert({ type: 'success', text: `${payload.course_code} was added.` });
      }
      resetForm();
      loadCourses(activeSearch);
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      setAlert({
        type: err.response?.status === 400 || err.response?.status === 409 ? 'warning' : 'danger',
        text: errorMessage(err, 'Could not save the course.'),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setValues({
      course_name: course.course_name,
      course_code: course.course_code,
      credits: String(course.credits),
      semester: String(course.semester),
    });
    setErrors({});
    setAlert(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const confirmDelete = async () => {
    const course = toDelete;
    setToDelete(null);
    try {
      await api.delete(`/courses/${course.id}`);
      if (editingId === course.id) resetForm();
      setAlert({ type: 'success', text: `${course.course_code} was deleted.` });
      loadCourses(activeSearch);
    } catch (err) {
      setAlert({ type: 'danger', text: errorMessage(err, 'Could not delete the course.') });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const code = search.trim();
    setActiveSearch(code);
    loadCourses(code);
  };

  const clearSearch = () => {
    setSearch('');
    setActiveSearch('');
    loadCourses();
  };

  return (
    <div className="pt-4">
      <div className="page-head">
        <h1 className="page-title">Manage courses</h1>
        <p className="page-sub">Add, search, edit and remove courses.</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible d-flex align-items-center gap-2`} role="alert">
          <i className={`bi ${ALERT_ICONS[alert.type]}`} />
          <div>{alert.text}</div>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlert(null)} />
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4" ref={formRef}>
          <CourseForm
            values={values}
            errors={errors}
            editing={Boolean(editingId)}
            saving={saving}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        </div>

        <div className="col-lg-8">
          <div className="panel overflow-hidden">
            <div className="panel-head">
              <h2 className="panel-title">
                All courses <span className="count-pill">{courses.length}</span>
              </h2>
              <form onSubmit={handleSearch} className="search-form">
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-search" /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by course code"
                    aria-label="Search by course code"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {activeSearch && (
                    <button type="button" className="btn btn-outline-secondary" onClick={clearSearch}>
                      Clear
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">Search</button>
                </div>
              </form>
            </div>
            <CourseTable
              courses={courses}
              loading={loading}
              searching={Boolean(activeSearch)}
              onEdit={handleEdit}
              onDelete={setToDelete}
            />
          </div>
        </div>
      </div>

      {toDelete && (
        <>
          <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <h2 className="modal-title fs-5">
                    <i className="bi bi-exclamation-triangle-fill text-danger me-2" />
                    Delete course?
                  </h2>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setToDelete(null)} />
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    <span className="code-chip me-2">{toDelete.course_code}</span>
                    {toDelete.course_name} will be removed permanently.
                  </p>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button className="btn btn-outline-secondary" onClick={() => setToDelete(null)}>Keep course</button>
                  <button className="btn btn-danger" onClick={confirmDelete}>Delete course</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </div>
  );
}
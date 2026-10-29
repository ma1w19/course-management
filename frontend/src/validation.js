export function validateCourse(values) {
  const errors = {};
  const name = values.course_name.trim();
  const code = values.course_code.trim().toUpperCase();
  const credits = String(values.credits).trim();
  const semester = String(values.semester).trim();

  if (!name) errors.course_name = 'Course name is required.';
  else if (name.length < 3 || name.length > 100)
    errors.course_name = 'Course name must be 3 to 100 characters.';

  if (!code) errors.course_code = 'Course code is required.';
  else if (!/^[A-Z]{2,4}[0-9]{3}$/.test(code))
    errors.course_code = 'Use 2–4 letters followed by 3 digits, e.g. CS301.';

  if (!credits) errors.credits = 'Credits are required.';
  else if (!/^[1-6]$/.test(credits)) errors.credits = 'Credits must be a whole number from 1 to 6.';

  if (!semester) errors.semester = 'Semester is required.';
  else if (!/^[1-8]$/.test(semester)) errors.semester = 'Semester must be from 1 to 8.';

  return errors;
}
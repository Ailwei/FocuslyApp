export function isEmail(email: string) {
  const re = /^[\w-.]+@[\w-]+\.[\w-.]+$/;
  return re.test(email);
}

export function validateCreateSessionInput(body: any) {
  const errors: string[] = [];
  if (!body) errors.push('Missing body');
  if (!body.user_id) errors.push('user_id is required');
  if (!body.task || typeof body.task !== 'string' || !body.task.trim())
    errors.push('task is required');
  if (body.duration_minutes == null) errors.push('duration_minutes is required');
  else if (typeof body.duration_minutes !== 'number' || body.duration_minutes <= 0)
    errors.push('duration_minutes must be a positive number');
  if (!body.completed_at) errors.push('completed_at is required');
  return errors;
}

export function validateCompleteSessionInput(body: any) {
  const errors: string[] = [];
  if (!body) errors.push('Missing body');
  if (!body.id) errors.push('id is required');
  return errors;
}

export function validateCreateUserInput(body: any) {
  const errors: string[] = [];
  if (!body) errors.push('Missing body');
  if (!body.email) errors.push('email is required');
  else if (!isEmail(body.email)) errors.push('email is invalid');
  if (body.password && typeof body.password === 'string' && body.password.length > 0 && body.password.length < 8)
    errors.push('password must be at least 8 characters');
  return errors;
}

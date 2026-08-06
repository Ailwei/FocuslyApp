import { createSupabaseClient, jsonResponse } from '../_shared.ts';
import type { CreateUserInput } from '../types.ts';
import { validateCreateUserInput } from '../validate.ts';

export async function handleCreateAccount(req: Request, supabaseClient?: any) {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const body = await req.json();

  const validation = validateCreateUserInput(body);

  if (validation.length) {
    return jsonResponse(
      { error: validation.join(', ') },
      400
    );
  }

  const {
    email,
    password,
    phone,
    user_metadata
  } = body as CreateUserInput;


  const supabase = supabaseClient ?? createSupabaseClient();


  const result = await supabase.auth.admin.createUser({
    email,
    password,
    phone,
    user_metadata,
    email_confirm: true,
  });


  if (result.error) {
    return jsonResponse(
      { error: result.error.message },
      500
    );
  }


  const createdUser = result.data.user;


  if (!createdUser) {
    return jsonResponse(
      { error: "User was not created" },
      500
    );
  }


  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: createdUser.id,
      email: createdUser.email,
      name: user_metadata?.name ?? null,
      member_since: new Date().toISOString(),
    });


  if (profileError) {

    console.log("PROFILE INSERT ERROR:", profileError);

    return jsonResponse(
      {
        user: createdUser,
        warning: profileError.message
      },
      201
    );
  }


  return jsonResponse(
    {
      user: createdUser
    },
    201
  );
}


export default function(req: Request) {
  return handleCreateAccount(req);
};
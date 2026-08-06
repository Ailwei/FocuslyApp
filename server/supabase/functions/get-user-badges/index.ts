import { createSupabaseClient, jsonResponse } from '../_shared.ts';


export async function handleGetUserBadges(
  req: Request,
  supabaseClient?: any
) {

  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }


  const supabase =
    supabaseClient ?? createSupabaseClient();


  try {

    const authHeader = req.headers.get('Authorization') ?? '';

    if (!authHeader.startsWith('Bearer ')) {
      return jsonResponse(
        { error: 'Missing authorization token' },
        401
      );
    }


    const token = authHeader.replace('Bearer ', '');


    // Get current user
    const userResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/auth/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        },
      }
    );


    if (!userResponse.ok) {
      return jsonResponse(
        { error: 'Invalid token' },
        401
      );
    }


    const user = await userResponse.json();

    const userId = user.id;


    console.log(
      "Getting badges for user:",
      userId
    );


    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        id,
        unlocked_at,
        badges (
          id,
          title,
          description,
          category,
          icon
        )
      `)
      .eq('user_id', userId)
      .order(
        'unlocked_at',
        {
          ascending:false
        }
      );


    if (error) {

      console.log(
        "BADGE QUERY ERROR:",
        error
      );

      return jsonResponse(
        {
          error:error.message
        },
        500
      );
    }


    return jsonResponse(
      {
        badges:data ?? []
      },
      200
    );


  } catch(error:any){

    console.log(
      "GET USER BADGES ERROR:",
      error
    );


    return jsonResponse(
      {
        error:error.message
      },
      500
    );
  }
}



export default function(req:Request){

  return handleGetUserBadges(req);

}
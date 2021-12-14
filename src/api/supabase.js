import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wxnkhrviinqieesgplts.supabase.co";
// const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDM2MzEzMiwiZXhwIjoxOTQ1OTM5MTMyfQ.Ly8hAtu7JRXUaXHoAcrNy9saL0ex6wbFKgjLcCbl5rI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey; 

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

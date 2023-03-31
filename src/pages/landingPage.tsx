import {Session} from '@supabase/supabase-js'
import {useEffect, useState} from 'react'
import { Alert, StyleSheet, View, Button, Text} from 'react-native';
import { supabase } from '../lib/supabaseClient';

export default function Landing({session}: {session: Session}) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() =>{
        if(session) getProfile()
    }, [session])

    async function getProfile(){
        try{
            
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!')
            
            let {data, error, status} = await supabase
                .from('profiles')
                .select(`username`)
                .eq('id', session?.user.id)
                .single()
            if(error && status !== 406){ console.log(error); throw error }
            if(data){
                console.log(data.username)
                setUsername(data.username)
            }
        }
        catch(error){
            if(error instanceof Error){ Alert.alert(error.message)}
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <View style={styles.container}>
            <Text>Hello, {username}</Text>
            <View>
                <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    }
})
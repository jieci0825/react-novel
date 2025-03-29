import { Text, View } from 'react-native'
import { useRouter } from 'expo-router/build/hooks'

export default function Index() {
    const router = useRouter()

    return (
        <>
            <View>
                <Text>首页</Text>
            </View>
        </>
    )
}

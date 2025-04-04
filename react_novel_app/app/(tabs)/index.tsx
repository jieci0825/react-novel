import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router/build/hooks'

export default function Index() {
    const router = useRouter()

    return (
        <>
            <View style={styles.homeContainer}>
                {/* header */}
                <View style={styles.homeHeader}>
                    {/* left */}
                    <View>
                        <Text>left</Text>
                    </View>
                    {/* center */}
                    <View>
                        <Text>center</Text>
                    </View>
                    {/* right */}
                    <View>
                        <Text>right</Text>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1
    },
    homeHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: 'red'
    },
    homeHeaderLeft: {}
})

import PageHeader from '@/components/page-header/page-header'
import { Text, View } from 'react-native'

function UserHeader() {
    return (
        <>
            <PageHeader title='个人中心' />
        </>
    )
}

export default function User() {
    return (
        <>
            <View>
                <UserHeader />
            </View>
        </>
    )
}

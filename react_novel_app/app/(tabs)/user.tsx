import PageHeader from '@/components/page-header/page-header'
import { useTheme } from '@/hooks/useTheme'
import { userContentStyles, userStyles } from '@/styles/tabs/user-style'
import { Text, TouchableOpacity, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import TextOverflowHidden from '@/components/text-overflow-hidden/text-overflow-hidden'

// 用户头部
function UserHeader() {
    const { theme } = useTheme()

    const goToEditProfile = () => {
        console.log('edit profile')
    }

    const slots = {
        right: () => (
            <TouchableOpacity onPress={goToEditProfile}>
                <Feather
                    name='edit'
                    size={RFValue(20)}
                    color={theme.tertiaryColor}
                />
            </TouchableOpacity>
        )
    }

    return (
        <>
            <PageHeader
                title='个人中心'
                slots={slots}
            />
        </>
    )
}

// 用户内容
function UserContent() {
    const { theme } = useTheme()

    const styles = userContentStyles(theme)

    return (
        <View style={styles.userContentWrap}>
            <View style={styles.avatarWrap}>
                <FontAwesome5
                    name='user-alt'
                    size={RFValue(20)}
                    color={theme.tertiaryColor}
                />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>用户名</Text>
                <TextOverflowHidden style={styles.userSign}>这个人很懒，什么都没留下~</TextOverflowHidden>
            </View>
        </View>
    )
}

export default function User() {
    const { theme } = useTheme()

    const styles = userStyles(theme)

    return (
        <View style={styles.container}>
            <UserHeader />
            <View style={styles.content}>
                <UserContent />
            </View>
        </View>
    )
}

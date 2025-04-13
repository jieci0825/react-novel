import { Button, ButtonText } from '@/components/ui/button'
import { CloseIcon, SearchIcon } from '@/components/ui/icon'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { useTheme } from '@/hooks/useTheme'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { useState } from 'react'
import { View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { searchBarStyles } from '@/styles/pages/search.style'

interface SearchPageProps {
    onSearch: (keyword: string) => void
    onFocus: () => void
}
// 搜索栏
export default function SearchBar(props: SearchPageProps) {
    const { theme } = useTheme()
    const styles = searchBarStyles(theme)

    const [keyword, setKeyword] = useState('')

    return (
        <View style={styles.searchBarWrap}>
            <View style={styles.searchBarLeft}>
                <AntDesign
                    name='arrowleft'
                    size={RFValue(24)}
                    color={theme.primaryColor}
                />
            </View>
            <View style={styles.searchBarCenter}>
                <Input
                    className='w-full'
                    variant='rounded'
                    size='sm'
                    isDisabled={false}
                    isInvalid={false}
                    isReadOnly={false}
                >
                    <InputSlot className='pr-2 pl-2'>
                        <InputIcon as={SearchIcon} />
                    </InputSlot>
                    <InputField
                        className='p-0 flex-1'
                        value={keyword}
                        onSubmitEditing={e => props.onSearch(keyword)}
                        onChangeText={v => setKeyword(v)}
                        onFocus={() => props.onFocus()}
                        placeholder='输入关键词查询'
                    />
                    <InputSlot
                        onPress={() => setKeyword('')}
                        className='pr-2 pl-2'
                    >
                        {!!keyword && <InputIcon as={CloseIcon} />}
                    </InputSlot>
                </Input>
            </View>
            <View style={styles.searchBarRight}>
                <FontAwesome5
                    name='random'
                    size={RFValue(22)}
                    color={theme.primaryColor}
                />
                <Button
                    size='xs'
                    variant='solid'
                    action='primary'
                    onPress={() => props.onSearch(keyword)}
                >
                    <ButtonText>搜索</ButtonText>
                </Button>
            </View>
        </View>
    )
}

import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useTheme } from "@/hooks/useTheme";
import {
  bookGridStyles,
  bookListStyles,
  homeContentStyles,
  homeHeaderStyles,
  homeStyles,
} from "@/styles/index-styles";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";

enum BookLayout {
  Grid = 1,
  List = 2,
}

interface HomeHeaderProps {
  setBookLayout: React.Dispatch<React.SetStateAction<BookLayout>>;
  bookLayout: BookLayout;
}
function HomeHeader(props: HomeHeaderProps) {
  const { theme } = useTheme();

  const styles = homeHeaderStyles(theme);

  const screenHeight = useWindowDimensions().height;
  const height = Math.max(screenHeight * 0.09, 60);

  return (
    <>
      <View style={[styles.homeHeader, { height }]}>
        <View style={[styles.headerAct, styles.homeHeaderLeft]}>
          <Entypo name="menu" size={RFValue(30)} color={theme.tertiaryColor} />
        </View>
        <View style={styles.homeCenter}>
          <Text style={styles.homeCenterText}>我的书架</Text>
        </View>
        <View style={[styles.headerAct]}>
          <TouchableOpacity
            onPress={() => props.setBookLayout(BookLayout.Grid)}
          >
            <View
              style={[
                styles.homeIconBox,
                props.bookLayout === BookLayout.Grid &&
                  styles.homeIconBoxActive,
              ]}
            >
              <MaterialCommunityIcons
                name="grid-large"
                size={RFValue(24)}
                color={
                  props.bookLayout === BookLayout.Grid
                    ? theme.primaryColor
                    : theme.tertiaryColor
                }
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.setBookLayout(BookLayout.List)}
          >
            <View
              style={[
                styles.homeIconBox,
                props.bookLayout === BookLayout.List &&
                  styles.homeIconBoxActive,
              ]}
            >
              <FontAwesome5
                name="list-ul"
                size={RFValue(24)}
                color={
                  props.bookLayout === BookLayout.List
                    ? theme.primaryColor
                    : theme.tertiaryColor
                }
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

interface BookItem {
  id: number;
  author: string;
  title: string;
  process: string;
}
interface BookLayoutProps {
  bookList: BookItem[];
}
function BookGridLayout(props: BookLayoutProps) {
  const { theme } = useTheme();

  const styles = bookGridStyles(theme);

  // 动态计算宽度，保证间隔是 20
  const [itemWidth, setItemWidth] = useState<number | string>("30%");

  // 监听屏幕宽度
  const { width: screenWidth } = useWindowDimensions();

  // 屏幕宽度超出 500 时候，每多100距离，就多一列
  const baseColumns = 3;
  const baseWidth = 500;
  // 计算列数
  const columns =
    screenWidth < baseWidth
      ? baseColumns
      : Math.floor((screenWidth - baseWidth) / 100) + baseColumns;

  // 因为不支持 grid 布局，所以需要手动分配成一个二维数组，每一项排列三个
  function chunkArray(array: BookItem[], chunkSize: number = columns) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  const bookList = chunkArray(props.bookList);

  return (
    <>
      <View
        onLayout={(e) => {
          // 宽度表示当前容器的宽度
          const { width } = e.nativeEvent.layout;
          // 减去间隔，书籍之间的两个 20
          // 然后剩余的宽度根据列数评分，即列数 - 1
          const iw = (width - 20 * (columns - 1)) / columns;
          setItemWidth(iw);
        }}
      >
        {bookList.map((item, index) => {
          return (
            <View style={[styles.bookRow]} key={index}>
              {item.map((book) => {
                return (
                  <View
                    // @ts-ignore
                    style={[styles.bookItem, { width: itemWidth }]}
                    key={book.id}
                  >
                    <View style={styles.bookCover}></View>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.bookTitle}
                    >
                      {book.title}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </>
  );
}

function BookListLayout(props: BookLayoutProps) {
  const { theme } = useTheme();

  const styles = bookListStyles(theme);

  return (
    <>
      {props.bookList.map((book) => {
        return (
          <View style={styles.bookItem} key={book.id}>
            <View style={styles.bookCover}></View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <Text style={styles.bookProcess}>{book.process}</Text>
            </View>
          </View>
        );
      })}
    </>
  );
}

interface HomeContentProps {
  bookLayout: BookLayout;
}
function HomeContent(props: HomeContentProps) {
  const { theme } = useTheme();

  const styles = homeContentStyles(theme);

  // const originBookList: BookItem[] = [
  //   {
  //     id: 1,
  //     title: "JavaScript高级程序设计",
  //     author: "佚名",
  //     process: "1/1000",
  //   },
  //   { id: 2, title: "深入理解TypeScript", author: "佚名", process: "1/1000" },
  //   { id: 3, title: "React设计原理与实战", author: "佚名", process: "1/1000" },
  //   {
  //     id: 4,
  //     title: "Node.js企业级应用开发",
  //     author: "佚名",
  //     process: "1/1000",
  //   },
  //   { id: 5, title: "Python机器学习手册", author: "佚名", process: "1/1000" },
  //   { id: 6, title: "数据结构与算法分析", author: "佚名", process: "1/1000" },
  //   { id: 7, title: "现代前端技术解析", author: "佚名", process: "1/1000" },
  //   { id: 8, title: "数据库系统概念", author: "佚名", process: "1/1000" },
  //   { id: 9, title: "计算机组成与设计", author: "佚名", process: "1/1000" },
  //   {
  //     id: 10,
  //     title: "计算机网络：自顶向下方法",
  //     author: "佚名",
  //     process: "1/1000",
  //   },
  // ];

  const originBookList: BookItem[] = [];

  const layoutComp: Record<BookLayout, React.ReactNode> = {
    [BookLayout.Grid]: BookGridLayout({ bookList: originBookList }),
    [BookLayout.List]: BookListLayout({ bookList: originBookList }),
  };

  return (
    <>
      <SafeAreaView style={styles.homeContent}>
        <ScrollView style={styles.homeContentInner}>
          {originBookList.length ? (
            layoutComp[props.bookLayout]
          ) : (
            <View style={styles.emptyTips}>
              <Text style={styles.emptyTipsText}>快去挑选你的书籍吧~</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default function Index() {
  const { theme } = useTheme();

  const styles = homeStyles(theme);

  const [bookLayout, setBookLayout] = useState<BookLayout>(BookLayout.Grid);

  return (
    <>
      <View style={styles.container}>
        <HomeHeader setBookLayout={setBookLayout} bookLayout={bookLayout} />
        <HomeContent bookLayout={bookLayout} />
      </View>
    </>
  );
}

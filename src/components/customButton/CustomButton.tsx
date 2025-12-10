 
 
import React from 'react';
import { DimensionValue, FlexAlignType, Image, ImageSourcePropType, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './style';
import InternalLoader from '../loaderView/internalLoader';
  

// Define the props interface for the CustomButton component
interface Props {
  text: string;
  height?: DimensionValue
  width?: DimensionValue
  borderRadius?: number;
  buttonColor?: string;
  textSize?: number;
  textColor?: string;
  textFontFamily?: string;
  image?: ImageSourcePropType;
  onPress: () => void;
  marginVertical?: number | any;
  borderColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  marginHorizontal?: number;
  imageHeight?: any;
  imageWidth?: any;
  imageAlignSelf?: FlexAlignType | "auto" | undefined;
  right?: number;
  isLoading?: boolean;
  loaderColor?: string;
  disable?: boolean;
  textRight?: number;
  tintColor?: string;
  backgroundColor?: any,
  paddingLeft?: number,
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase"
}
/**
 * CustomButton is a flexible button component with customizable styles, an optional loader,
 * and an image icon. It supports various props for layout, colors, text styles, and loading state.
 */
const CustomButton: React.FC<Props> = props => {
  const {
    text,
    height,
    width,
    borderRadius,
    buttonColor,
    textSize,
    textColor,
    textFontFamily,
    image,
    marginVertical,
    onPress,
    borderColor,
    paddingHorizontal,
    paddingVertical,
    marginHorizontal,
    imageHeight,
    imageWidth,
    imageAlignSelf,
    right,
    isLoading,
    loaderColor,
    disable,
    textRight,
    tintColor,
    textTransform,
    backgroundColor,
    paddingLeft,
  } = props;

  return (

    <Pressable
      // Handle button press only if not loading or disabled
      onPress={() => !isLoading && !disable && onPress()}
      style={{
        marginTop: marginVertical ?? 0,
        width: width ?? '100%',
        elevation:10,
      }}

    >
      <View
        // Main button container styling
        style={[
          styles.buttonView,
          {
            height: height ?? 50, // Set height or use default
            borderRadius: borderRadius ?? 10, // Set border radius or use default
            backgroundColor: disable ? (backgroundColor ?? "#808080") : (backgroundColor ?? "#0000ff"), // disabled uses gray by default
            marginHorizontal: marginHorizontal,
            borderWidth: 0,
            opacity: disable ? 0.7 : 1,
          },
        ]}>
        {!isLoading ? (
          <>
            {image && (
              // Optional image section
              <View
                style={{
                  flex: text ? 0.8 : 3, // Adjust flex based on text presence
                  alignItems: text ? 'center' : 'flex-start', // Align image with optional padding
                  paddingRight: imageAlignSelf ? 10 : 0,
                  paddingLeft: paddingLeft ? 10 : 0,
                }}>
                <Image
                  source={image}
                  resizeMode="contain"

                  style={{
                    height: imageHeight ?? 20, // Set image height or use default
                    width: imageWidth ?? 18, // Set image width or use default
                    alignSelf: imageAlignSelf,
                    right: right,
                    tintColor: tintColor


                  }}
                />
              </View>
            )}
            <View
              // Text container
              style={{
                flex: image ? 4 : 0, // Adjust flex based on image presence
                alignItems: 'center', // Center-align the text
              }}>
              <Text
                style={{
                  fontSize: textSize ?? 18, // Set text size or use default
                    color: disable ? "#808080" : textColor ?? "#ffffff", // Set text color, consider disabled state
                  fontFamily: textFontFamily ?? "Bold", // Set font family or use default
                  paddingHorizontal: paddingHorizontal ?? 0,
                  paddingVertical: paddingVertical ?? 0,
                  right: textRight,
                  letterSpacing: 2,
                  textTransform: textTransform ?? 'capitalize', // Text transformation option
                  textAlign: 'center',
                  fontWeight: "bold"
                }}>
                {text}
              </Text>
            </View>

          </>
        ) : (
          // Show loader when isLoading is true
          <InternalLoader colors={loaderColor ?? "#ffffff"} />
        )}
      </View>
    </Pressable>
  );
};

/**
 * Memoization function to avoid unnecessary re-renders by comparing previous and next props.
 * Only re-renders if 'text' or 'onPress' props change.
 */
const itemPropsAreEqual = (prevProps: any, nextProps: any) => {
  return (
    prevProps.text == nextProps.text &&
    prevProps.onPress == nextProps.onPress &&
    prevProps.disable == nextProps.disable &&
    prevProps.isLoading == nextProps.isLoading
  );
};
// Exporting CustomButton with React.memo to enhance performance by preventing re-renders
export default React.memo(CustomButton, itemPropsAreEqual);

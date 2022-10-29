import { CSSProperties, ReactNode } from "react";
import { Pagination, Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

type Size = Required<Pick<CSSProperties, "width" | "height">>;
export type TransferCardProps<T> = Size & {
  list: T[];
  itemKey: (item: T) => string;
  children: (item: T) => ReactNode;
};
const TransferCard = <T,>(props: TransferCardProps<T>) => {
  const { list, itemKey, children, width, height } = props;
  return (
    <Swiper
      style={{ width, height }}
      modules={[Pagination, Virtual]}
      pagination
      direction="vertical"
      virtual
    >
      {list.map((item) => {
        return <SwiperSlide key={itemKey(item)}>{children(item)}</SwiperSlide>;
      })}
    </Swiper>
  );
};

export default TransferCard;

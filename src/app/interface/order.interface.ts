interface IOrder {
  id: number;
  name: string;
  address: string;
  mobilePhone: string;
  dateX: Date;
  date: any;
  timeFrom: string;
  timeTo: string;
  problem: string;
  comment: string;
  user: IUser;
  userDetails?: IUser;
  lat: number;
  lng: number;
  isVisible: boolean;
  isSelected: boolean;
  color: string;
  colorMarkerDetails: {image: string, color: string, id: number};
  currentPlace?: {lat: number, lng: number};
}

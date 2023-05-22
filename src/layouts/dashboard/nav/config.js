// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Home',
    path: '/dashboard/url', // app
    icon: icon('ic_analytics'),
  },
  // {
  //   title: 'Sign out',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
];

export default navConfig;

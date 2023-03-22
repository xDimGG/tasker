import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const Home = () => {
	const { setTitle } = useOutletContext();
	useEffect(() => setTitle('Home'), [setTitle]);

	return (
		<div className="App">
			<header className="App-header">
				<p style={{margin: 0, fontSize: 30}}>
          Edit <code>src/App.js</code> and save to reload.
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam suscipit et risus eu condimentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ex lacus, malesuada nec tortor quis, imperdiet convallis dui. Cras orci diam, porttitor eu mattis vel, mattis sed est. Pellentesque id erat id nisi laoreet suscipit. Sed tincidunt, urna vitae ultricies pulvinar, tellus urna facilisis dui, a consequat lectus ante non mi. Suspendisse ultrices interdum efficitur. Mauris nisl felis, commodo at tellus non, pharetra sagittis ex. Nam faucibus leo non leo tempor pulvinar.

Maecenas id nisl leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum at commodo nunc, et lobortis nunc. Vestibulum massa enim, fermentum quis molestie et, dignissim eu turpis. Etiam hendrerit rhoncus lacus. In luctus nisi a purus auctor auctor. Maecenas facilisis congue ante eu fermentum.

Sed consequat metus ac bibendum efficitur. Donec pretium nisi at mi euismod aliquet. Duis quam nisi, tincidunt sed mollis vitae, condimentum ut lectus. Vivamus tempor tincidunt diam in tristique. Sed vehicula eros in rhoncus convallis. Curabitur dictum elit vestibulum velit vestibulum, sed dapibus nisi sodales. In hac habitasse platea dictumst.

Vestibulum at cursus libero, at maximus orci. Curabitur neque leo, dignissim vel odio non, faucibus ullamcorper dui. Mauris gravida gravida congue. Praesent id pretium nisi, in pellentesque massa. Vivamus eget iaculis massa, a sollicitudin leo. Suspendisse tristique, justo ut condimentum fringilla, elit magna mattis orci, non viverra turpis orci nec neque. Sed feugiat molestie tortor vitae ullamcorper. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eros nisl, rutrum non dictum nec, accumsan eget lectus. Integer posuere molestie velit et egestas. In a nunc ac sapien egestas semper. Mauris et velit suscipit, suscipit eros eget, aliquam sem.

Fusce sit amet molestie arcu. Quisque pulvinar dolor leo, malesuada pharetra tortor porttitor vitae. Donec finibus justo non lacus lobortis, a tincidunt turpis sodales. Aliquam id lorem commodo, viverra mi cursus, tincidunt metus. Suspendisse non mi eget nisi placerat consequat. In feugiat faucibus nunc sit amet egestas. Nunc vitae sagittis lorem. Integer eleifend consectetur egestas. Sed at elit lacinia, iaculis tellus eget, finibus libero. Nunc vestibulum ipsum justo, sit amet consequat nisi luctus sit amet. Donec lorem est, fringilla at augue at, gravida auctor metus.


				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
          Learn React
				</a>
			</header>
		</div>
	);
};

export default Home;

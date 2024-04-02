window.addEventListener("DOMContentLoaded", init); 

function init() { 
    const width = 500; 
	const height = 500;
	let flag_move = 0;
	let moveX = 0;
	let moveY = 0;
	let radX = 0;
	let radY = 0;
	let count_c = 0;
	let count_bulbe = 0;
	let flag_p = 0;
	let count_p = 0;
	let speed_p = 0.5;
	
    // レンダラーを作成 
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector("#myCanvas") 
    }); 
    renderer.setSize(width, height); /* ウィンドウサイズの設定 */ 
    renderer.setClearColor(0xdcdcdc); /* 背景色の設定 */ 

    // シーンを作成 
    const scene = new THREE.Scene(); 

    // カメラを作成 
    const camera = new THREE.PerspectiveCamera(45, width / height); 
    camera.position.set(0, 20, -70); 
    camera.lookAt(new THREE.Vector3(0,0,0));
	
	//色
	const orange = new THREE.MeshStandardMaterial({ 
		color: 0xff9302
    });
    const blue = new THREE.MeshStandardMaterial({ 
        color: 0x09308a
	}); 
	const yellow = new THREE.MeshStandardMaterial({ 
        color: 0xffd700
	}); 
	
	const white = new THREE.MeshStandardMaterial({ 
		color: 0xffffff
	}); 
	
	const gray = new THREE.MeshStandardMaterial({ 
		color: 0x696969
	}); 

	const black = new THREE.MeshStandardMaterial({ 
		color: 0x222222
	}); 

	
	

	//棒人間のオブジェクト
	const stickMan = new THREE.Group();

	const stickhead = new THREE.Mesh(new THREE.SphereGeometry(1, 50, 50), 
	new THREE.MeshStandardMaterial({ 
		color: 0xffffff
	}) 
	);
	stickhead.position.set(0,11.5,-3);
	stickMan.add(stickhead);

	const stickbody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 50, 50), black);
	stickbody.position.set(0,9,-3);
	stickMan.add(stickbody);

	const stickarm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 50, 50), black);
	stickarm1.rotateZ(Math.PI/6);
	stickarm1.rotateX(-1*Math.PI/6);
	stickarm1.position.set(0.5,9,-2.5);
	stickMan.add(stickarm1);

	const stickarm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 50, 50), black);
	stickarm2.rotateZ(-1*Math.PI/6);
	stickarm2.rotateX(-1*Math.PI/6);
	stickarm2.position.set(-0.5,9,-2.5);
	stickMan.add(stickarm2);

	const stickleg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 50, 50), black);
	stickleg1.rotateX(Math.PI/2);
	stickleg1.rotateZ(Math.PI/6);
	stickleg1.position.set(0.5,8,-4);
	stickMan.add(stickleg1);

	const stickleg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 50, 50), black);
	stickleg2.rotateX(Math.PI/2);
	stickleg2.rotateZ(-1*Math.PI/6);
	stickleg2.position.set(-0.5,8,-4);
	stickMan.add(stickleg2);


	scene.add(stickMan);
	stickMan.visible = false;//不可視

	

	//電球のオブジェクト
	const bulbe = new THREE.Group();
	const offwires = new THREE.Group();
    const onwires = new THREE.Group();

	const glass = new THREE.Mesh(new THREE.SphereGeometry(7,10,50),white);
	glass.material.transparent = true;// 透明の表示許可
	glass.material.alphaToCoverage = true;
	glass.material.opacity = 0.5;
	glass.position.set(0,17,0);
	bulbe.add(glass);
	
	for(let n = 0; n<3; n++){
		const base = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.7, 50,50),gray);
		base.rotateX(Math.PI/2);
		base.position.set(0,10.5 - n,0);
		bulbe.add(base);
	}
	
	const wire = new THREE.Mesh(new THREE.TorusGeometry(5,0.8,3,3),gray);
	wire.rotateZ(Math.PI/6);
	wire.position.set(0,13,0);
	bulbe.add(wire);

	for(let n = 0; n<4; n++){//電源off状態のフィラメント
		const hotwire = new THREE.Mesh(new THREE.TorusGeometry(1.5,0.4),gray);
		hotwire.rotateY(Math.PI/2);
		hotwire.position.set(3.3 - 2*n ,16,0);
		offwires.add(hotwire);
	}

	for(let n = 0; n<4; n++){//電源on状態のフィラメント
		const hotwire = new THREE.Mesh(new THREE.TorusGeometry(1.5,0.4),yellow);
		hotwire.rotateY(Math.PI/2);
		hotwire.position.set(3.3 - 2*n ,16,0);
		onwires.add(hotwire);
	}

	scene.add(offwires);
	scene.add(onwires);
	scene.add(bulbe);
	bulbe.visible = false;//不可視
	offwires.visible = false;//不可視
	onwires.visible = false;//不可視

	//プロペラ
	const propeller = new THREE.Group();

	const wing1 = new THREE.Mesh(new THREE.BoxGeometry(2,0.5,8),yellow);
	wing1.rotateY(Math.PI/2);
	wing1.position.set(-4,12,0);
	propeller.add(wing1);

	const wing2 = new THREE.Mesh(new THREE.BoxGeometry(2,0.5,8),yellow);
	wing2.rotateY(Math.PI/2);
	wing2.position.set(4,12,0);
	propeller.add(wing2);

	const shaft = new THREE.Mesh(new THREE.SphereGeometry(1,50,50,0,Math.PI),blue);
	shaft.rotateX(-1*Math.PI/2);
	shaft.position.set(0,12,0);
	propeller.add(shaft);

	const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,5,50,50),yellow);
	pivot.position.set(0,10,0);
	propeller.add(pivot);

	scene.add(propeller);
	propeller.visible = false;//不可視 
	
	const head = new THREE.Mesh(new THREE.BoxGeometry(12,8,8),orange);
	head.position.set(0,14,0);

	const eye1 = new THREE.Mesh(new THREE.BoxGeometry(1,2.5,0.5),blue);
    eye1.position.set(3,15,-4);

    const eye2 = new THREE.Mesh(new THREE.BoxGeometry(1,2.5,0.5),blue);
    eye2.position.set(-3,15,-4);

    const mouse = new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,1,3),blue);
    mouse.position.set(0,11.5,-4);
    mouse.rotation.set(Math.PI/2,Math.PI,0);
	
	const ear1 = new THREE.Mesh(new THREE.TorusGeometry(1.5,0.8,3,3),yellow);
	ear1.position.set(7.5,14,0);
	
	const ear2 = new THREE.Mesh(new THREE.TorusGeometry(1.5,0.8,3,3),yellow);
	ear2.position.set(-7.5,14,0);
	ear2.rotateY(Math.PI);
	
	//group作成
	const face = new THREE.Group();
	face.add(head,eye1,eye2,mouse,ear1,ear2);
	scene.add(face);
	
	const body = new THREE.Mesh(new THREE.CylinderGeometry(10,5,20,50,50), blue);
	
	const arm1 = new THREE.Mesh(new THREE.ConeGeometry(3,15,50,50),yellow);
	arm1.position.set(7.5,-5,0);
	
	const arm2 = new THREE.Mesh(new THREE.ConeGeometry(3,15,50,50),yellow);
	arm2.position.set(-7.5,-5,0);
	
	//grup作成
	const upper = new THREE.Group();
	upper.add(body, arm1, arm2);
	
	const leg1 = new THREE.Mesh(new THREE.TorusGeometry(2,0.5,50,50),orange);
	leg1.position.set(3,-10,0);
	leg1.rotateY(Math.PI/2);
	
	const leg2 = new THREE.Mesh(new THREE.TorusGeometry(2,0.5,50,50),orange);
	leg2.position.set(-3,-10,0);
	leg2.rotateY(Math.PI/2);
	
	//フルパーツをgroup化
	const robot = new THREE.Group();
	robot.add(face, upper, leg1, leg2);
	scene.add(robot);
	
	robot.position.set(0,-10,0);

	//視点移動
	document.addEventListener('mousedown', onDocumentMouseDown, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);

	function  onDocumentMouseMove(event_m) {
		moveX = event_m.offsetX;
		moveY = event_m.offsetY;

		animate();
	}

	function onDocumentMouseDown(){
		flag_move = 1;//クリックしたときに視点を動かせるようにする。
	}
	function onDocumentMouseUp(){
		flag_move = 0;//マウスを離した時に視点移動を停止させる。
	}	

	function animate(){
		if(flag_move == 1){
			let requestId = requestAnimationFrame(animate);
			//マウスの位置に応じて目標の角度（ラジアン）を設定
			const targetRadX = (moveX/window.innerWidth)*Math.PI*2;
			const targetRadY = (moveY/window.innerHeight)*Math.PI*2;
			//イージングの公式により目標値に近づくと減速する
			radX += (targetRadX - radX)*0.02;
			radY += (targetRadY - radY)*0.02;

			//カメラ位置を設定する
			//window座標においてx軸移動はrender座標においてはx軸とz軸の移動になる
			camera.position.x = 60*Math.sin(radX);
			camera.position.z = 60*Math.cos(radX);

			//window座標においてy軸移動はrender座標においてはy軸とz軸の移動になる
			camera.position.y = 60*Math.sin(radY);
			camera.position.z = 60*Math.cos(radY);

			camera.lookAt(new THREE.Vector3(0,0,0));
			render();

		}

		
	}

	//コスチュームチェンジ&オプション機能
	document.addEventListener("keydown", onDocumentKeyDown, false);
	function onDocumentKeyDown(event_k) {
        let keyCode = event_k.which;
        // c: コスチュームチェンジ
		if(keyCode == 67) {
			count_c += 1;
			if(count_c %4== 0){
				propeller.visible = false;
			}
			else if(count_c %4 == 1){
				stickMan.visible = true;
			}
			else if(count_c %4 == 2){
				stickMan.visible = false;
				bulbe.visible = true;
				offwires.visible = true;
			}
			else if(count_c %4 == 3){
				bulbe.visible = false;
				offwires.visible = false;
				pointLight.visible = false;
				onwires.visible = false;
				if(count_bulbe %2 == 1){
					count_bulbe += 0;
				}
				propeller.visible = true;
			}
		}
		// o: オプション機能
		if(keyCode == 79){
			if(count_c %4 == 2){//電球のコスチュームのとき
				count_bulbe += 1;
				if(count_bulbe %2 == 0){
					pointLight.visible = false;
					onwires.visible = false;
					offwires.visible = true;
				}
				else{
					pointLight.visible = true;
					onwires.visible = true;
					offwires.visible = false;
				}
				
			}
			else if(count_c %4 == 3){//プロペラのコスチュームのとき
				flag_p = 1;
				fly();
			}

		}
		render();
	}

	function fly(){
		if(speed_p < 0){
			speed_p = 0.5;
			flag_p = 0;
			count_p = 0;
		}
		else if(flag_p == 1){
			let requestId = requestAnimationFrame(fly);
			if(count_p >= 33){
				propeller.rotation.y += speed_p;
				speed_p -= 0.005;
			}
			else if(count_p >= 31){
				propeller.rotation.y += 0.5;
				propeller.position.y -= 0.08;
				face.position.y -= 0.08;
				upper.position.y -= 0.08;
				count_p += 0.1;
			}
			else if(count_p >= 20){
				propeller.rotation.y += 0.5;
				propeller.position.y -= 0.08;
				robot.position.y -= 0.08;
				count_p += 0.1;
			}
			else if(count_p >= 10){
				propeller.rotation.y += 0.5;
				count_p += 0.1;
			}
			else if(count_p >= 2){
				propeller.rotation.y += 0.5;
				propeller.position.y += 0.1;
				robot.position.y += 0.1
				count_p += 0.1;
			}
			else if(count_p >= 0){
				propeller.rotation.y += 0.5;
				propeller.position.y += 0.1;
				face.position.y += 0.1;
				upper.position.y += 0.1;
				count_p += 0.1;
			}

			render();

		}
	}
	
	//電球を点けた時の光源
	const pointLight = new THREE.PointLight(0xff4500,10);
	pointLight.position.set(0,17,0);
	scene.add(pointLight);
	pointLight.visible = false;//不可視

	//基本光源
    const ambientLight = new THREE.AmbientLight(0xffffff,2);
    scene.add(ambientLight);

	// 初回実行 
    let render = function () { renderer.render(scene, camera); };
    render();
} 